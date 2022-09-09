export default async function useShell(cmd: string, shell = 'pwsh', cb = Function()): Promise<any> {
  const result = ref()

  try {
    const command = await new Command(shell, ['/C', cmd]).execute()
    result.value = command.stdout
    cb()
  }
  catch (err) {
    result.value = err
  }

  return result.value
}
