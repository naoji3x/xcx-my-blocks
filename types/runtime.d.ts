type Runtime = {
  formatMessage: FormatMessage
  on(event: string, func: Function): void
}
