import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import { Props as UpdateDataProps } from "../../actions/updateUserData.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface UserData {
  data: { UserAttributes: { Name: string; Value: string }[] };
  dataProfile: Omit<UpdateDataProps, "name cpf address"> & {
    address: UpdateDataProps["address"][];
    created_at?: Date;
    association: { name: string; logo_url: string };
    qrcode_url: string;
  };
}

export interface Props {
  cardSkeleton: ImageWidget;
}

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês é baseado em zero
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function EcannaCardPage({ cardSkeleton }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>();
  const [created_at, setCreatedAt] = useState<Date>();
  const [association, setAssociation] = useState<
    { name: string; logo_url: string }
  >();
  const [qrcode, setQrcode] = useState<string>();

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

          const date = res.dataProfile?.created_at;
          const associationObj = res.dataProfile?.association;
          const qr = res.dataProfile?.qrcode_url;

          setUserData(res);
          setAssociation(associationObj);
          setQrcode(qr);
          setCreatedAt(new Date(String(date)));

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
    <div class="container flex justify-center">
      <div class="bg-slate-300 rounded-xl p-24 flex flex-col items-center justify-center">
        {isLoading
          ? <span class="loading loading-spinner loading-xs" />
          : (
            <div class="relative">
              {userData && (
                <div class="absolute z-10 top-[68px] left-[30px]">
                  <Image
                    class="rounded-md"
                    src={userData.dataProfile.avatar_photo}
                    alt={"user selfie"}
                    width={108}
                    height={144}
                  />
                </div>
              )}
              {userData && (
                <div class="absolute z-10 flex flex-col top-[65px] left-[165px]">
                  <span class="text-[#0E391A] font-semibold text-lg">
                    {userData?.data?.UserAttributes?.find((a) =>
                      a.Name === "name"
                    )?.Value}
                  </span>
                  <span class="text-sm font-semibold">
                    CPF{"  "}{userData?.data?.UserAttributes?.find((a) =>
                      a.Name === "custom:cpfcnpj"
                    )?.Value.replace(
                      /(\d{3})(\d{3})(\d{3})(\d{2})/,
                      "$1.$2.$3-$4",
                    )}
                  </span>
                  {association && (
                    <span class="text-sm font-semibold pr-1">
                      {association.name}
                    </span>
                  )}
                  <span class="text-sm font-semibold">
                    {userData?.dataProfile?.address[0]?.neighborhood.split(
                      ",",
                    )[1]}
                  </span>
                </div>
              )}
              {association && (
                <div class="absolute z-10 top-[204px] left-[165px]">
                  <Image
                    class=""
                    src={association.logo_url}
                    alt={"Logo Associação"}
                    width={117}
                    height={32}
                  />
                </div>
              )}
              {qrcode && (
                <div class="absolute z-10 top-[160px] left-[301px] bg-[#262626] rounded-md p-2">
                  <Image
                    class=""
                    src={qrcode}
                    alt={"Logo Associação"}
                    width={66}
                    height={66}
                  />
                </div>
              )}
              {created_at && (
                <div class="absolute z-10 flex flex-col top-[224px] left-[30px]">
                  <span class="text-white text-[10px]">
                    Emissão:{"  "}{formatDate(created_at)}
                  </span>
                </div>
              )}

              <Image
                class="card"
                src={cardSkeleton}
                alt="Carteirinha eCanna"
                width={395}
                height={260}
                loading="lazy"
              />
            </div>
          )}
      </div>
    </div>
  );
}

export default EcannaCardPage;
