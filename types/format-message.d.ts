type LocaleSetup = {
  locale: string
  translations: { [key: string]: string }
}

type FormatMessage = {
  (messageData: MessageData): string
  setup?(): LocaleSetup
}
