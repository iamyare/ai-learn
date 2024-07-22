import { getFolder } from "@/actions"
import Link from "next/link"

export default async function Folder({params}: {params: {folder: string}}) {

  const { folder, errorFolder } = await getFolder({ folderId: params.folder})


  return (
    <div>
      <h1>{folder?.folder_name}</h1>

      <p>
        This is a folder page.
      </p>
      <ul>
        {
          folder?.notebooks.map(notebook => (
            <li key={notebook.id}>
              <Link href={
                `/[username]/[folder]/[notebook]`
                .replace('[username]', folder.user_id)
                .replace('[folder]', notebook.folder_id)
                .replace('[notebook]', notebook.id)
              }>{notebook.notebook_name}</Link>
            </li>
          ))
        }
      </ul>

    </div>
  )
}
