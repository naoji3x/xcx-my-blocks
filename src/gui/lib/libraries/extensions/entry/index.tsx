/**
 * This is an extension for Xcratch.
 */

import iconURL from './entry-icon.png'
import insetIconURL from './inset-icon.svg'
import translations from './translations.json'

/**
 * Formatter to translate the messages in this extension.
 * This will be replaced which is used in the React component.
 * @param {object} messageData - data for format-message
 * @returns {string} - translated message for the current locale
 */
let formatMessage: FormatMessage = (messageData: MessageData): string =>
  messageData.defaultMessage ? messageData.defaultMessage : 'default message'

const entry = {
  get name() {
    return formatMessage({
      id: 'myBlocks.entry.name',
      default: 'My Blocks',
      description: 'name of the extension'
    })
  },
  extensionId: 'myBlocks',
  extensionURL: 'https://naoji3x.github.io/xcx-my-blocks/dist/myBlocks.mjs',
  collaborator: 'naoji3x',
  iconURL: iconURL,
  insetIconURL: insetIconURL,
  get description() {
    return formatMessage({
      default: 'an extension for Xcratch',
      description: 'Description for this extension',
      id: 'myBlocks.entry.description'
    })
  },
  featured: true,
  disabled: false,
  bluetoothRequired: false,
  internetConnectionRequired: false,
  helpLink: 'https://naoji3x.github.io/xcx-my-blocks/',
  setFormatMessage: (formatter: FormatMessage) => {
    formatMessage = formatter
  },
  translationMap: translations
}

export { entry } // loadable-extension needs this line.
export default entry
