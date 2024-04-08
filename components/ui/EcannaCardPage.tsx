import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import { Props as UpdateDataProps } from "../../actions/updateUserData.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "../../components/ui/Icon.tsx";

export interface UserData {
  data: { UserAttributes: { Name: string; Value: string }[] };
  dataProfile: Omit<UpdateDataProps, "name cpf address"> & {
    address: UpdateDataProps["address"][];
    created_at?: Date;
    association: { name: string; logo_url: string };
    qrcode_url: string;
    ecannacard_url?: string;
  };
}

export interface Props {
  cardSkeleton: ImageWidget;
}

function EcannaCardPage({ cardSkeleton }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [cardUrl, setCardUrl] = useState<string>();

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    const accessToken = localStorage.getItem("AccessToken") || "";

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
          const res = r as UserData;

          setCardUrl(res.dataProfile.ecannacard_url);

          setIsLoading(false);
        });
    } catch (e) {
      alert(
        "Não foi possível carregar dados do usuário. Tente novamente mais tarde ou contecte o suporte.",
      );
      setIsLoading(false);
    }
  }, []); // Passando um array de dependências vazio
  return (
    <div class="flex flex-col justify-center items-center my-10 gap-[100px] sm:gap-[30px]">
      <div class="rotate-90 sm:rotate-0 flex justify-center p-3 sm:p-12 bg-[#252525] rounded-xl max-w-[424px] sm:max-w-[90%]">
        {cardUrl
          ? (
            <Image
              class="card"
              src={cardUrl}
              alt={"Carteirinha eCanna"}
              width={395}
              height={260}
              loading="lazy"
            />
          )
          : (
            <div>
              <span class="text-white">
                Este usuário não possui carteirinha. Atualize seus dados de
                paciente na página de "Meus Dados".
              </span>
            </div>
          )}
      </div>
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-[4%] max-w-[90%]">
        <a
          href={cardUrl}
          class="flex btn btn-primary text-white w-full sm:w-[48%]"
        >
          <span>Baixar Carteirinha</span> <Icon id="Download" height={19} />
        </a>
      </div>
    </div>
  );
}

export default EcannaCardPage;
