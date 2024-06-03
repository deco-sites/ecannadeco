import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import { Props as UpdateDataProps } from "../../actions/updateUserData.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Loading from "../../components/daisy/Loading.tsx";
import CheckoutUpsellModal from "../../islands/CheckoutUpsellModal.tsx";
import {
  Product,
  SavedCreditCard,
} from "../../components/ui/CheckoutUpsellModal.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

export interface UserData {
  data: { UserAttributes: { Name: string; Value: string }[] };
  dataProfile: Omit<UpdateDataProps, "name cpf address"> & {
    address: UpdateDataProps["address"][];
    created_at?: Date;
    association: { name: string; logo_url: string; cnpj: string };
    qrcode_url: string;
    credit_cards: SavedCreditCard[];
    ecannacard_url: string;
  };
}

export interface Props {
  cardSkeleton: ImageWidget;
}

function EcannaCardPage({ cardSkeleton }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [userData, setUserData] = useState<UserData>();
  const [_created_at, setCreatedAt] = useState<Date>();
  const [_association, setAssociation] = useState<
    { name: string; logo_url: string; cnpj: string }
  >();
  const [_qrcode, setQrcode] = useState<string>();
  const [creditCards, setCreditCards] = useState<SavedCreditCard[]>([]);
  const [cardProduct, setCardProduct] = useState<Product>({} as Product);

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
        .then(async (r) => {
          const res = r as UserData;
          console.log({ user: res });
          const date = res.dataProfile?.created_at;
          const associationObj = res.dataProfile?.association;
          const qr = res.dataProfile?.qrcode_url;

          setUserData(res);
          setAssociation(associationObj);
          setQrcode(qr);
          setCreatedAt(new Date(String(date)));

          setLoadingProduct(true);

          const cardsResponse = await invoke["deco-sites/ecannadeco"].actions
            .getCardProduct({
              token: accessToken,
            });

          setLoadingProduct(false);

          const cardProducts = cardsResponse as { docs: Product[] };

          setCardProduct(cardProducts.docs[0]);

          setCreditCards(res.dataProfile.credit_cards);

          setIsLoading(false);
        });
    } catch (_e) {
      alert(
        "Não foi possível carregar dados do usuário. Tente novamente mais tarde ou contecte o suporte.",
      );
      setIsLoading(false);
    }
  }, []); // Passando um array de dependências vazio

  function downloadFile(fileUrl: string, filename: string) {
    // Fetch the file data
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary anchor element
        const a = document.createElement("a");
        a.style.display = "none";

        // Set the download attribute and file URL
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);

        // Append the anchor to the body and trigger the download
        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  }

  return (
    <div class="flex flex-col justify-center items-center my-10 gap-[100px] sm:gap-[30px]">
      <div class="rotate-90 sm:rotate-0 flex justify-center p-3 sm:p-12 bg-[#252525] rounded-xl max-w-[424px] sm:max-w-[90%] text-[#1878b8]">
        {isLoading
          ? <span class="loading loading-spinner loading-xs" />
          : (
            <div id="ecannaCard" class="relative text-[#1878b8]">
              <Image
                class="card"
                src={userData?.dataProfile?.ecannacard_url || cardSkeleton}
                alt="Carteirinha eCanna"
                width={352}
                height={234}
                loading="lazy"
              />
            </div>
          )}
      </div>
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-[4%] max-w-[90%]">
        <CheckoutUpsellModal
          creditCards={creditCards}
          product={cardProduct}
          address={userData?.dataProfile?.address[0]!}
        />

        {userData?.dataProfile?.ecannacard_url
          ? (
            <button
              type="button"
              download
              onClick={() =>
                downloadFile(
                  userData?.dataProfile?.ecannacard_url,
                  `${userData?.dataProfile?.name}-ecanna-carteirinha.png`,
                )}
              class="flex btn btn-primary text-white w-full sm:w-[48%]"
            >
              <span>Baixar Carteirinha</span>
              <Icon id="Download" size={19} />
            </button>
          )
          : null}

        <button
          type="button"
          download="carteirinha.png"
          disabled
          class="flex btn btn-primary text-white w-full sm:w-[48%]"
        >
          <div class="flex items-center gap-2">
            <span>Nova Via Física (Breve)</span> {loadingProduct
              ? <Loading style="loading-spinner" size="loading-xs" />
              : (
                <div class="p-2 bg-white text-primary text-xs rounded-md">
                  {cardProduct.price == 0
                    ? "Grátis"
                    : ("R$" + (cardProduct.price / 100).toFixed(2))}
                </div>
              )}
          </div>
        </button>
      </div>
    </div>
  );
}

export default EcannaCardPage;
