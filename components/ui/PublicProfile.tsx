import type { PublicProfile } from "../../loaders/getPublicProfile.ts";
import PageWrap from "../../components/ui/PageWrap.tsx";
import Image from "apps/website/components/Image.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { useState } from "preact/hooks";

export interface Props {
  publicProfile: PublicProfile;
}

function PublicProfileComponent({ publicProfile }: Props) {
  const [insertedPin, setInsertedPin] = useState("");
  const [pinError, _setPinError] = useState("");

  console.log({ publicProfile });
  return (
    <PageWrap>
      {publicProfile.name
        ? (
          publicProfile?.plan === "DEFAULT" ||
            publicProfile?.association.status === "INACTIVE"
            ? (
              <div class="join w-full flex justify-center flex-col items-center gap-5">
                <span class="text-[#d69b09]">
                  <Icon id="Warn" size={60} />
                </span>
                <span class="font-bold">
                  {publicProfile?.association.status === "INACTIVE"
                    ? "A associação do paciente está com a conta inativa. Entre em contato com a associação para recuperar a função da carteirinha"
                    : "O paciente está com a conta inativa e deve renovar a assinatura do serviço para que a carteirinha volte a funcionar"}
                </span>
              </div>
            )
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
                  src={publicProfile?.avatar_photo
                    ? publicProfile?.avatar_photo
                    : "http://drive.google.com/uc?export=view&id=1tSFTp0YZKVQVGJHOqzKaJw6SEe7Q8LL7"}
                  alt={"user selfie"}
                  width={108}
                  height={144}
                />
                <div class="flex flex-col items-center">
                  {publicProfile?.name && publicProfile?.cpf
                    ? (
                      <div class="flex flex-col items-center">
                        <span class="text-2xl text-secondary font-semibold">
                          {publicProfile?.name}
                        </span>
                        <span class="text-secondary font-semibold">
                          CPF:
                          {" " +
                            publicProfile?.cpf.replace(
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
                          email{" "}
                          <span class="font-bold">{publicProfile?.email}</span>
                          {" "}
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

                  {publicProfile?.association &&
                    publicProfile.associationApproved &&
                    publicProfile?.association.cnpj !== "47774121000154" && (
                    <div class="flex flex-col items-center mt-4">
                      <span class="text-[#5B5B5B] font-semibold text-sm">
                        Associação: {publicProfile?.association.name}
                      </span>
                      <span class="text-[#5B5B5B] font-semibold text-sm">
                        CNPJ {publicProfile?.association.cnpj.replace(
                          /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                          "$1.$2.$3/$4-$5",
                        )}
                      </span>
                      <div>
                        {publicProfile.associationApproved && (
                          <div class="bg-primary text-white p-1 flex items-center gap-2 rounded-md mt-2">
                            <Icon id="Verified" size={18} />
                            <span class="font-semibold text-[10px]">
                              Vínculo associativo comprovado
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div class="flex flex-col items-start w-full overflow-hidden">
                  {publicProfile?.cids && publicProfile?.cids.length
                    ? (
                      <>
                        <h2 class="text-[#8b8b8b] font-semibold mb-4 mt-10 w-full">
                          CIDs (Diagnósticos)
                        </h2>
                        <ul class="flex flex-col gap-2 max-w-[100%]">
                          {publicProfile?.cids.map((c) => {
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
                      </>
                    )
                    : null}
                </div>
                <div class="flex flex-col items-start w-full">
                  <h2 class="text-[#8b8b8b] font-semibold mb-4 mt-10 w-full">
                    Documentos do Paciente
                  </h2>
                  <ul class="flex flex-col gap-2 w-full">
                    {publicProfile?.documents &&
                      publicProfile?.documents.map((doc) => {
                        return (
                          <li>
                            <a class="w-full" href={doc.file_url}>
                              <div class="flex justify-between rounded-md bg-[#C8C8C8] w-full px-5 h-10 items-center">
                                <div class="flex gap-2">
                                  <span class="text-[#8F8D8D]">
                                    <Icon id="Anexo" size={19} />
                                  </span>
                                  <span class="text-[#393939] text-xs sm:text-sm truncate max-w-[230px] sm:max-w-full">
                                    {doc.title}
                                  </span>
                                </div>
                                <span class="text-[#8F8D8D] flex justify-end w-6">
                                  <Icon id="Download" height={16} />
                                </span>
                              </div>
                            </a>
                          </li>
                        );
                      })}
                  </ul>
                </div>
                {publicProfile?.association &&
                    publicProfile.associationApproved &&
                    publicProfile?.associationDocuments &&
                    publicProfile?.associationDocuments.length &&
                    publicProfile?.association.cnpj !== "47774121000154"
                  ? (
                    <div class="flex flex-col items-start w-full">
                      <h2 class="text-[#8b8b8b] font-semibold mb-4 mt-10 w-full">
                        Documentos da {publicProfile?.association.name}
                      </h2>
                      <ul class="flex flex-col gap-2 w-full">
                        {publicProfile?.associationDocuments.map((doc) => {
                          return (
                            <li>
                              <a class="w-full" href={doc.file_url}>
                                <div class="flex justify-between rounded-md bg-[#C8C8C8] w-full px-5 h-10 items-center">
                                  <div class="flex gap-2">
                                    <span class="text-[#8F8D8D]">
                                      <Icon id="Anexo" size={19} />
                                    </span>
                                    <span class="text-[#393939] text-xs sm:text-sm truncate max-w-[230px] sm:max-w-full">
                                      {doc.title}
                                    </span>
                                  </div>
                                  <span class="text-[#8F8D8D] flex justify-end w-6">
                                    <Icon id="Download" height={16} />
                                  </span>
                                </div>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )
                  : null}
                <div class="bg-gray-200 p-2 rounded-md leading-3 flex items-center gap-3">
                  <Icon id="Info" size={50} />
                  <span class="text-[10px] text-[#333]">
                    Este é um serviço feito para que pacientes de cannabis
                    medicinal disponibilizem seus documentos de forma
                    facilitada, caso haja qualquer necessidade de fiscalização.
                    A condição de paciente se respalda exclusivamente na
                    validade dos documentos médicos/jurídicos que porventura se
                    encontrem anexados e disponíveis nesta página. O ecanna não
                    se responsabiliza por falsidade ideológica, falta de
                    documentos ou prestação de informação falsa por parte dos
                    seus usuários.
                  </span>
                </div>
              </div>
            )
        )
        : (
          <div class="join w-full flex justify-center flex-col items-center gap-5">
            <span>
              Requisite ao paciente o número do PIN, presente na área interna de
              gestão da carteirinha, para visualizar as informações
            </span>
            <label class="join-item">
              <input
                type="password"
                placeholder="PIN"
                name="pin"
                class="input rounded-md rounded-r-none text-[#8b8b8b] border border-[#ececec]"
                value={insertedPin}
                onChange={(e) =>
                  e.target && setInsertedPin(e.currentTarget.value)}
              />
              <a
                class="btn btn-ghost bg-secondary text-white join-item"
                type="button"
                href={`/ficha/${publicProfile?._id}/${insertedPin}`}
              >
                Verificar PIN {
                  /* {isLoadingPostalCode && (
                <span class="loading loading-spinner text-green-600"></span>
              )} */
                }
              </a>
            </label>
            {pinError && <span class="text-red-700">{pinError}</span>}
          </div>
        )}
    </PageWrap>
  );
}

export default PublicProfileComponent;
