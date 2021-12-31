import fs from 'fs'
import { NRC_STANDALONE } from '../interfaces/MinecraftVersion'
import { checkMD5, downloadAndWriteFile, getMCDir, getOS, installLibraries } from './InstallerUtils'
import 'babel-polyfill'
import AdmZip from 'adm-zip'
import { Client, Authenticator } from 'minecraft-launcher-core'
// eslint-disable-next-line camelcase
import * as child_process from 'child_process'
import { ChildProcessWithoutNullStreams } from 'child_process'
import { launchGame } from './LaunchUtils'
import { LauncherProps } from '../interfaces/LauncherProps'

export const installNoRiskStandAlone = (props: LauncherProps): Promise<ChildProcessWithoutNullStreams> => {
  const launcher = new Client();

  let opts = {
    clientPackage: "",
    // For production launchers, I recommend not passing
    // the getAuth function through the authorization field and instead
    // handling authentication outside before you initialize
    // MCLC so you can handle auth based errors and validation!
    authorization: {
      access_token: LauncherProfile.accessToken,
      client_token: '',
      uuid:  LauncherProfile.minecraftProfile.id,
      name: LauncherProfile.minecraftProfile.name,
      user_properties: '{}',
      meta: {
        type: 'mojang' || 'msa',
        // properties only exists for specific Minecraft versions.
        xuid: '',
        clientId: ''
      }
    }
    root: "./minecraft",
    version: {
      number: "1.14",
      type: "release"
    },
    memory: {
      max: "6G",
      min: "4G"
    }
  }
  launcher.launch(opts);
  launcher.on('debug', (e) => console.log(e));
  launcher.on('data', (e) => console.log(e));
}

const checkForVersionsFolder = (props: LauncherProps): Promise<ChildProcessWithoutNullStreams> => {
  const versionsDir = getMCDir() + '/versions/' + NRC_STANDALONE.folderName
  const nrcDir = getMCDir() + '/altura/'
  const profile = props.profile
  const setStatus = props.setStatus
  return new Promise<ChildProcessWithoutNullStreams>(resolve => {
    downloadAndWriteFile('https://noriskclient.de/downloads/launcher/1.8.9-NRC.json', {
      filename: '1.8.9-NRC.json',
      directory: versionsDir,
      setStatus: setStatus
    }).then(() => {
      return downloadAndWriteFile('https://launcher.mojang.com/v1/objects/3870888a6c3d349d3771a3e9d16c9bf5e076b908/client.jar', {
        filename: '1.8.9-NRC.jar',
        directory: versionsDir,
        setStatus: setStatus
      })
    }).then(() => {
      return downloadAndWriteFile('https://noriskclient.de/downloads/optifine_1.8.9.zip', {
        filename: 'optifine_1.8.9.zip',
        directory: versionsDir,
        setStatus: setStatus
      })
    }).then(() => {
      return downloadAndWriteFile('https://noriskclient.de/downloads/MergeZips.jar', {
        filename: 'MergeZips.jar',
        directory: nrcDir,
        setStatus: setStatus
      })
    }).then(() => {
      return child_process.spawn('java', ['-jar', `${getMCDir() + '/norisk/MergeZips.jar'}`,
        getMCDir() + '/versions/' + NRC_STANDALONE.folderName + '/1.8.9-NRC.jar',
        getMCDir() + '/versions/' + NRC_STANDALONE.folderName + '/1.8.9-NRC-TEMP.jar',
        getMCDir() + '/versions/' + NRC_STANDALONE.folderName + '/optifine_1.8.9.zip',
        fs.readFileSync(getMCDir() + '/versions/' + NRC_STANDALONE.folderName + '/1.8.9-NRC.jar').length <= 8561484 ? 'false' : 'true'
      ], { cwd: getMCDir(), detached: false })
    }).then(value => {
      return new Promise(resolve => {
        value.stdout.on('data', () => {
          resolve()
        })
      })
    }).then(() => {
      return downloadAndWriteFile('https://noriskclient.de/downloads/lwjgl-2.9.3.zip', {
        filename: 'lwjgl-2.9.3.zip',
        fileToCheck: getMCDir() + '/norisk/natives/lwjgl-2.9.3/native/' + getOS(),
        directory: nrcDir,
        setStatus: setStatus
      })
    }).then(() => {
      const zip = new AdmZip(getMCDir() + '/norisk/lwjgl-2.9.3.zip')
      return zip.extractAllToAsync(getMCDir() + '/norisk/natives', true)
    }).then(() => {
      return downloadAndWriteFile('https://noriskclient.de/downloads/client/sha256sum.txt', {
        filename: 'sha256sum.txt',
        directory: nrcDir,
        setStatus: setStatus
      }, true)
    }).then(() => {
      setStatus('Checking for latest version')
      return checkMD5(
        getMCDir() + '/libraries/de/noriskclient/NoRiskClient/1.8.9/NoRiskClient-1.8.9.jar',
        getMCDir() + '/norisk/sha256sum.txt')
    }).then(latestVersion => {
      setStatus(`Latest version: ${latestVersion}`)
      if (!latestVersion) {
        return downloadAndWriteFile('https://noriskclient.de/downloads/client/latest.jar', {
          filename: 'NoRiskClient-1.8.9.jar',
          directory: getMCDir() + '/libraries/de/noriskclient/NoRiskClient/1.8.9/',
          setStatus: setStatus
        }, true)
      }
    }).then(() => {
      installLibraries(NRC_STANDALONE, () => {
        props.setIsStarting(false)
        setStatus('Starting Game')
        resolve(launchGame(NRC_STANDALONE, profile))
      })
    })
  })
}
