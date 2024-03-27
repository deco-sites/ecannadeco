import type { PublicProfile } from "../../loaders/getPublicProfile.ts";
import Image from "apps/website/components/Image.tsx";

interface Props {
  publicProfile: PublicProfile;
}

function PublicProfileComponent(
  { publicProfile }: Props,
) {
  const { cpf, name, cids, plan, documents, avatar_photo, association } =
    publicProfile;
  return (
    <div>
      {!publicProfile.cpf
        ? <span>Usuário não encontrado</span>
        : (
          <div class="flex flex-col items-center gap-5">
            <h1>Cadastro de Paciente Medicinal de Canabis</h1>
            <Image
              src={avatar_photo}
              alt={"user selfie"}
              width={108}
              height={144}
            />
            <div class="flex flex-col items-center gap-2">
              <span>{name}</span>
              <span>{cpf}</span>
              {association && <span>Associação: {association.name}</span>}
            </div>
            <div class="flex flex-col items-start">
              <span>Diagnóstico</span>
              <ul class="flex flex-col gap-2">
                {cids.map((c) => {
                  return (
                    <li>
                      <div class="bg-slate-300 w-full flex items-center">
                        <span>
                          CID{" " + c.full_code + " - " + c.name}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div class="flex flex-col items-start">
              <span>Documentos do Paciente</span>
              <ul class="flex flex-col gap-2">
                {documents.map((doc) => {
                  return (
                    <li>
                      <a href={doc.file_url}>
                        <div class="bg-slate-300 w-full flex items-center gap-11">
                          <span>
                            {doc.title}
                          </span>
                          <span>
                            {doc.category}
                          </span>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
    </div>
  );
}

export default PublicProfileComponent;
