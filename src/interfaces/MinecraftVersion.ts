import { LauncherProps } from './LauncherProps'
import { ChildProcessWithoutNullStreams } from 'child_process'
import { installNoRiskFabric } from '../installer/FabricInstaller'
import { installNoRiskForge } from '../installer/ForgeInstaller'
import { installNoRiskStandAlone } from '../installer/StandAloneInstaller'

export interface MinecraftVersion {
  name: string,
  mainClass: string,
  folderName: string;
  jsonPath: string,
  assetIndex: string
  nativePath?: string,
  jarPath: string,
  tweakClass?: string,
  libraries?: string,
  startGame: (props: LauncherProps) => Promise<ChildProcessWithoutNullStreams> | undefined,
}

export const NRC_STANDALONE = {
  name: '1.8.9 Altura',
  assetIndex: '1.8',
  mainClass: 'net.minecraft.launchwrapper.Launch',
  libraries: 'MCDIR/libraries/com/mojang/netty/1.6/netty-1.6.jar;MCDIR/libraries/oshi-project/oshi-core/1.1/oshi-core-1.1.jar;MCDIR/libraries/net/java/dev/jna/jna/3.4.0/jna-3.4.0.jar;MCDIR/libraries/net/java/dev/jna/platform/3.4.0/platform-3.4.0.jar;MCDIR/libraries/com/ibm/icu/icu4j-core-mojang/51.2/icu4j-core-mojang-51.2.jar;MCDIR/libraries/net/sf/jopt-simple/jopt-simple/4.6/jopt-simple-4.6.jar;MCDIR/libraries/com/paulscode/codecjorbis/20101023/codecjorbis-20101023.jar;MCDIR/libraries/com/paulscode/codecwav/20101023/codecwav-20101023.jar;MCDIR/libraries/com/paulscode/libraryjavasound/20101123/libraryjavasound-20101123.jar;MCDIR/libraries/com/paulscode/librarylwjglopenal/20100824/librarylwjglopenal-20100824.jar;MCDIR/libraries/com/paulscode/soundsystem/20120107/soundsystem-20120107.jar;MCDIR/libraries/io/netty/netty-all/4.0.23.Final/netty-all-4.0.23.Final.jar;MCDIR/libraries/com/google/guava/guava/17.0/guava-17.0.jar;MCDIR/libraries/org/apache/commons/commons-lang3/3.3.2/commons-lang3-3.3.2.jar;MCDIR/libraries/commons-io/commons-io/2.4/commons-io-2.4.jar;MCDIR/libraries/commons-codec/commons-codec/1.9/commons-codec-1.9.jar;MCDIR/libraries/net/java/jinput/jinput/2.0.5/jinput-2.0.5.jar;MCDIR/libraries/net/java/jutils/jutils/1.0.0/jutils-1.0.0.jar;MCDIR/libraries/com/google/code/gson/gson/2.2.4/gson-2.2.4.jar;MCDIR/libraries/com/mojang/authlib/1.5.21/authlib-1.5.21.jar;MCDIR/libraries/com/mojang/realms/1.7.59/realms-1.7.59.jar;MCDIR/libraries/org/apache/commons/commons-compress/1.8.1/commons-compress-1.8.1.jar;MCDIR/libraries/org/apache/httpcomponents/httpclient/4.3.3/httpclient-4.3.3.jar;MCDIR/libraries/commons-logging/commons-logging/1.1.3/commons-logging-1.1.3.jar;MCDIR/libraries/org/apache/httpcomponents/httpcore/4.3.2/httpcore-4.3.2.jar;MCDIR/libraries/org/apache/logging/log4j/log4j-api/2.0-beta9/log4j-api-2.0-beta9.jar;MCDIR/libraries/org/apache/logging/log4j/log4j-core/2.0-beta9/log4j-core-2.0-beta9.jar;MCDIR/libraries/org/lwjgl/lwjgl/lwjgl/2.9.4-nightly-20150209/lwjgl-2.9.4-nightly-20150209.jar;MCDIR/libraries/org/lwjgl/lwjgl/lwjgl_util/2.9.4-nightly-20150209/lwjgl_util-2.9.4-nightly-20150209.jar;MCDIR/libraries/tv/twitch/twitch/6.5/twitch-6.5.jar;MCDIR/libraries/de/noriskclient/NoRiskClient/1.8.9/NoRiskClient-1.8.9.jar;MCDIR/libraries/net/minecraft/launchwrapper/1.12/launchwrapper-1.12.jar;MCDIR/versions/1.8.9-NRC/1.8.9-NRC.jar',
  jsonPath: '/versions/1.8.9-NRC/1.8.9-NRC.json',
  jarPath: '/versions/1.8.9-NRC/1.8.9-NRC.jar',
  folderName: 'AlturaClient',
  startGame: (props: LauncherProps): Promise<ChildProcessWithoutNullStreams> | undefined => installNoRiskStandAlone(props)
}

export const NRCVersions: Array<MinecraftVersion> = [NRC_STANDALONE, NRC_FORGE, NRC_FABRIC_1_16_4]
