import { getFolder } from "@/actions"

export default async function Folder({params}: {params: {folder: string}}) {

  const { folder, errorFolder } = await getFolder({ folderId: params.folder})

  console.log(folder, errorFolder)

  return (
    <div>
      <h1>Folder</h1>

      <p>
        This is a folder page.
      </p>
      <ul>

      </ul>

    </div>
  )
}
