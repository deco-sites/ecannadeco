import PageWrap from "deco-sites/ecannadeco/components/ui/PageWrap.tsx";
import { invoke } from "../../runtime.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Props as UpdateDataProps } from "../../actions/updateUserData.ts";
import { useEffect, useState } from "preact/hooks";
import Image from "apps/website/components/Image.tsx";

export type Associations = {
  name: string;
  logo_url: string;
  cnpj: string;
  treatment_access_url: string;
}[];

function TreatmentAccess() {
  const [association, setAssociation] = useState<{
    name: string;
    logo_url: string;
    cnpj: string;
    treatment_access_url: string;
  }>();
  const [isLoading, setIsLoading] = useState(true);
  const [associations, setAssociations] = useState<Associations>();

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
    }

    if (accessToken === "") {
      window.location.href = "/";
    }

    try {
      setIsLoading(true);

      invoke["deco-sites/ecannadeco"].actions
        .getUser({
          token: accessToken,
        })
        .then((r) => {
          const res = r as {
            data: { UserAttributes: { Name: string; Value: string }[] };
            dataProfile: Omit<UpdateDataProps, "name cpf address"> & {
              _id: string;
              card_name: string;
              address: UpdateDataProps["address"][];
              associationApproved?: boolean;
              association: {
                name: string;
                logo_url: string;
                cnpj: string;
                treatment_access_url: string;
              };
            };
          };

          if (res.dataProfile.association) {
            setAssociation(res.dataProfile.association);
          } else {
            invoke["deco-sites/ecannadeco"].actions
              .getAssociations({
                token: accessToken,
              })
              .then((r: unknown) => {
                console.log({ associations: r });
                const res = r as { docs: Associations };
                setAssociations(res.docs);
              });
          }

          console.log({ r });
          setIsLoading(false);
        });
    } catch (_e) {
      alert(
        "Não foi possível carregar dados do usuário. Tente novamente mais tarde ou contecte o suporte.",
      );
      setIsLoading(false);
    }
  }, []); // Passando um array de dependências vazio
  return (
    <PageWrap>
      <div class="flex flex-col items-center gap-4">
        <h1 class="text-2xl text-[#8b8b8b] font-semibold">
          Acesso ao Tratamento com Cannabis
        </h1>
        {isLoading
          ? <span class="loading loading-spinner" />
          : association
          ? (
            <div class="flex flex-col gap-4 items-center">
              <span>
                Você está associado(a) à{" "}
                <span class="font-bold">{association.name}</span>
              </span>
              <Image
                src={association?.logo_url}
                alt={`${association.name} logo`}
                width={108}
                // height={144}
              />
              {association.treatment_access_url
                ? (
                  <div class="flex flex-col gap-4 items-center">
                    <span>
                      Para ter acesso ao tratamento com cannabis através da sua
                      associação, clique no botão abaixo
                    </span>
                    <a
                      class="btn btn-primary text-white"
                      href={association.treatment_access_url}
                      target="_blank"
                    >
                      Acessar Tratamento
                    </a>
                  </div>
                )
                : (
                  <div>
                    Procure sua associação para ter acesso ao tratamento com
                    cannabis
                  </div>
                )}
            </div>
          )
          : (
            <div class="flex flex-col gap-4">
              <span class="text-center">
                Você pode obter acesso ao tratamento com cannabis por meio da
                sua associação de preferência. Confira abaixo a nossa lista de
                associações!
              </span>
              <div class="flex flex-wrap gap-[2%] md:gap-[4%]">
                {associations?.map((a) => {
                  return (
                    <a
                      target="_blank"
                      href={`${
                        a.treatment_access_url
                          ? a.treatment_access_url
                          : `https://www.google.com/search?q=${
                            a.name
                              .split(" ")
                              .join("+")
                          }+cannabis+medicinal`
                      }`}
                      class="p-4 rounded-md bg-gray-200 flex flex-col items-start w-[49%] sm:w-[32%] md:w-[22%] mb-3"
                    >
                      {
                        /* <Image
                      src={a?.logo_url}
                      alt={`${a.name} logo`}
                      width={108}
                      // height={144}
                    /> */
                      }
                      <span class="uppercase text-xs">{a.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    </PageWrap>
  );
}

export default TreatmentAccess;
