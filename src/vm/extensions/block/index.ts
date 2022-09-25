import BlockType from '../../extension-support/block-type'
import ArgumentType from '../../extension-support/argument-type'
import Cast from '../../util/cast'
import translations from './translations.json'
import blockIcon from './block-icon.png'

/**
 * Formatter which is used for translation.
 * This will be replaced which is used in the runtime.
 * @param {object} messageData - format-message object
 * @returns {string} - message for the locale
 */
let formatMessage: FormatMessage = (messageData: MessageData): string =>
  messageData.defaultMessage

/**
 * Setup format-message for this extension.
 */
const setupTranslations = () => {
  const localeSetup = formatMessage.setup && formatMessage.setup()
  if (localeSetup && localeSetup.translations[localeSetup.locale]) {
    Object.assign(
      localeSetup.translations[localeSetup.locale],
      translations[localeSetup.locale as keyof typeof translations]
    )
  }
}

const EXTENSION_ID = 'myBlocks'

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://naoji3x.github.io/xcx-my-blocks/dist/myBlocks.mjs'

/**
 * Scratch 3.0 blocks for example of Xcratch.
 */
class ExtensionBlocks {
  private runtime: Runtime
  private audioCtx: AudioContext = new AudioContext()

  /**
   * @return {string} - the name of this extension.
   */
  static get EXTENSION_NAME() {
    return formatMessage({
      id: 'myBlocks.name',
      defaultMessage: 'My Blocks',
      description: 'name of the extension'
    })
  }

  /**
   * @return {string} - the ID of this extension.
   */
  static get EXTENSION_ID() {
    return EXTENSION_ID
  }

  /**
   * URL to get this extension.
   * @type {string}
   */
  static get extensionURL() {
    return extensionURL
  }

  /**
   * Set URL to get this extension.
   * The extensionURL will be changed to the URL of the loading server.
   * @param {string} url - URL
   */
  static set extensionURL(url) {
    extensionURL = url
  }

  /**
   * Construct a set of blocks for My Blocks.
   * @param {Runtime} runtime - the Scratch 3.0 runtime.
   */
  constructor(runtime: Runtime) {
    /**
     * The Scratch 3.0 runtime.
     * @type {Runtime}
     */
    this.runtime = runtime

    if (runtime.formatMessage) {
      // Replace 'formatMessage' to a formatter which is used in the runtime.
      formatMessage = runtime.formatMessage
    }

    this.runtime.on('PROJECT_STOP_ALL', () => {
      this.resetAudio()
    })
    this.resetAudio()
  }

  resetAudio() {
    if (this.audioCtx) {
      this.audioCtx.close()
    }
    this.audioCtx = new AudioContext()
  }

  playTone(args: { FREQ: number; TYPE: OscillatorType; DUR: number }) {
    const oscillator = this.audioCtx.createOscillator()
    oscillator.connect(this.audioCtx.destination)
    oscillator.type = args.TYPE
    oscillator.frequency.value = Cast.toNumber(args.FREQ)
    oscillator.start()
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        oscillator.stop()
        resolve()
      }, Cast.toNumber(args.DUR) * 1000)
    })
  }

  /**
   * @returns {object} metadata for this extension and its blocks.
   */
  getInfo() {
    setupTranslations()
    return {
      id: ExtensionBlocks.EXTENSION_ID,
      name: ExtensionBlocks.EXTENSION_NAME,
      extensionURL: ExtensionBlocks.extensionURL,
      blockIconURI: blockIcon,
      showStatusButton: false,
      blocks: [
        {
          opcode: 'playTone',
          blockType: BlockType.COMMAND,
          blockAllThreads: false,
          text: formatMessage({
            id: 'myBlocks.playTone',
            defaultMessage: 'play [TYPE] wave [FREQ] Hz [DUR] s',
            description: 'tone'
          }),
          func: 'playTone',
          arguments: {
            FREQ: {
              type: ArgumentType.NUMBER,
              defaultValue: 440
            },
            TYPE: {
              type: ArgumentType.STRING,
              menu: 'waveTypeMenu'
            },
            DUR: {
              type: ArgumentType.NUMBER,
              defaultValue: 1
            }
          }
        }
      ],
      menus: {
        waveTypeMenu: {
          acceptReporters: false,
          items: ['sine', 'square', 'sawtooth', 'triangle']
        }
      }
    }
  }
}

export { ExtensionBlocks as default, ExtensionBlocks as blockClass }
