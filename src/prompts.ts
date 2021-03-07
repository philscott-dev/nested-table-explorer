import inquirer from 'inquirer'
import type { PathMap } from './helpers'

export async function promptUrl(): Promise<{ url: string }> {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: 'Please enter your api endpoint url',
    },
  ])
}

export async function promptPaths(
  pathMap: PathMap,
): Promise<{ userTemplates: string[] }> {
  return inquirer.prompt([
    {
      type: 'checkbox',
      message: 'Which paths would you like to appaer in your final table?',
      name: 'userTemplates',
      choices: [
        new inquirer.Separator('= Paths ='),
        ...Object.entries(pathMap).map(([name]) => ({ name })),
      ],
    },
  ])
}
