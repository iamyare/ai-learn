import { getFolder } from "@/actions"
import Link from "next/link"

export default async function Folder({params}: {params: {folder: string}}) {

  const { folder, errorFolder } = await getFolder({ folderId: params.folder})

  console.log(folder)

  if (!folder){
    return <div>No hya folder</div>
  }


  return (
    <div>
      <h1>{folder.folder_name}</h1>


      <ul className="mt-5">
        {
          folder.notebooks.map((notebook, index) => (
            <li key={notebook.notebook_id || index}>
              <Link href={
                `/[username]/[folder]/[notebook]`
                .replace('[username]', folder.user_id)
                .replace('[folder]', notebook.folder_id)
                .replace('[notebook]', notebook.notebook_id)
              }>{notebook.notebook_name}</Link>
            </li>
          ))
        }
      </ul>

    </div>
  )
}
