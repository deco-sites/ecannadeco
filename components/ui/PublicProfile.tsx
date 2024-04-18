import type { PublicProfile } from "../../loaders/getPublicProfile.ts";
import PageWrap from "../../components/ui/PageWrap.tsx";
import Image from "apps/website/components/Image.tsx";
import Icon from "../../components/ui/Icon.tsx";

interface Props {
  publicProfile: PublicProfile;
}

function PublicProfileComponent(
  { publicProfile }: Props,
) {
  const {
    cpf,
    name,
    cids,
    plan,
    documents,
    associationDocuments,
    avatar_photo,
    association,
    _id,
    email,
  } = publicProfile;

  console.log({ publicProfile });
  return (
    <PageWrap>
      {!_id
        ? <span>Usuário não encontrado</span>
        : (
          <div class="flex flex-col items-center gap-5 max-w-[95%]">
            <div class="flex items-center gap-4 text-secondary">
              <Icon id="MedCanna" size={34} />
              <h1 class="font-semibold">
                Cadastro de Paciente Medicinal de Canabis
              </h1>
            </div>
            <Image
              class="rounded-md"
              src={avatar_photo
                ? avatar_photo
                : "http://drive.google.com/uc?export=view&id=1tSFTp0YZKVQVGJHOqzKaJw6SEe7Q8LL7"}
              alt={"user selfie"}
              width={108}
              height={144}
            />
            <div class="flex flex-col items-center">
              {name && cpf
                ? (
                  <div class="flex flex-col items-center">
                    <span class="text-2xl text-secondary font-semibold">
                      {name}
                    </span>
                    <span class="text-secondary font-semibold">
                      CPF:{" " + cpf.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/,
                        "$1.$2.$3-$4",
                      )}
                    </span>
                  </div>
                )
                : (
                  <div class="p-3 flex flex-col items-center text-[#5e5e5e] text-sm bg-[#cecece] rounded-md gap-3">
                    <span class="text-center">
                      Informação Pendente: Paciente deve fazer cadastro com
                      email <span class="font-bold">{email}</span>{" "}
                      e atualizar dados médicos / pessoais.
                    </span>
                    <a
                      href="/cadastrar"
                      class="btn btn-primary btn-xs text-white"
                    >
                      Clique aqui para cadastrar
                    </a>
                  </div>
                )}

              {association && (
                <div class="flex flex-col items-center mt-4">
                  <span class="text-[#5B5B5B] font-semibold text-sm">
                    Associação: {association.name}
                  </span>
                  <span class="text-[#5B5B5B] font-semibold text-sm">
                    CNPJ {association.cnpj.replace(
                      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                      "$1.$2.$3/$4-$5",
                    )}
                  </span>
                </div>
              )}
            </div>
            <div class="flex flex-col items-start w-full overflow-hidden">
              <h2 class="text-[#8b8b8b] font-semibold mb-4 mt-10 w-full">
                CIDs (Diagnósticos)
              </h2>
              {cids && cids.length
                ? (
                  <ul class="flex flex-col gap-2 max-w-[100%]">
                    {cids.map((c) => {
                      return (
                        <li>
                          <div class="badge badge-secondary text-white gap-2 p-3 max-w-[100%]">
                            <span class="text-[10px] sm:text-sm truncate">
                              CID{" " + c.full_code + " - " + c.name}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )
                : (
                  <div class="p-3 flex flex-col items-center text-[#5e5e5e] text-sm bg-[#cecece] rounded-md gap-3">
                    <span class="text-center">
                      Informação Pendente: Paciente deve fazer cadastro com
                      email <span class="font-bold">{email}</span>{" "}
                      e atualizar dados médicos / pessoais.
                    </span>
                    <a
                      href="/cadastrar"
                      class="btn btn-primary btn-xs text-white"
                    >
                      Clique aqui para cadastrar
                    </a>
                  </div>
                )}
            </div>
            <div class="flex flex-col items-start w-full">
              <h2 class="text-[#8b8b8b] font-semibold mb-4 mt-10 w-full">
                Documentos do Paciente
              </h2>
              <ul class="flex flex-col gap-2 w-full">
                {documents.map((doc) => {
                  return (
                    <li>
                      <a class="w-full" href={doc.file_url}>
                        <div class="flex justify-between rounded-md bg-[#C8C8C8] w-full px-5 h-10 items-center">
                          <div class="flex gap-2">
                            <span class="text-[#8F8D8D]">
                              <Icon id="Anexo" size={24} />
                            </span>
                            <span class="text-[#393939] font-semibold">
                              {doc.title}
                            </span>
                          </div>
                          <span class="text-[#8F8D8D] flex justify-end w-6">
                            <Icon id="Download" height={19} />
                          </span>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            {association && (
              <div class="flex flex-col items-start w-full">
                <h2 class="text-[#8b8b8b] font-semibold mb-4 mt-10 w-full">
                  Documentos da {association.name}
                </h2>
                <ul class="flex flex-col gap-2 w-full">
                  {associationDocuments.map((doc) => {
                    return (
                      <li>
                        <a class="w-full" href={doc.file_url}>
                          <div class="flex justify-between rounded-md bg-[#C8C8C8] w-full px-5 h-10 items-center">
                            <div class="flex gap-2">
                              <span class="text-[#8F8D8D]">
                                <Icon id="Anexo" size={24} />
                              </span>
                              <span class="text-[#393939] font-semibold">
                                {doc.title}
                              </span>
                            </div>
                            <span class="text-[#8F8D8D] flex justify-end w-6">
                              <Icon id="Download" height={19} />
                            </span>
                          </div>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
    </PageWrap>
  );
}

export default PublicProfileComponent;
