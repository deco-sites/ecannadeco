import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import { Props as UpdateDataProps } from "../../actions/updateUserData.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "../../components/ui/Icon.tsx";
import type { Address } from "../../components/ui/MyAccount.tsx";
import Loading from "../../components/daisy/Loading.tsx";
import CheckoutUpsellModal from "../../islands/CheckoutUpsellModal.tsx";
import {
  Product,
  SavedCreditCard,
} from "../../components/ui/CheckoutUpsellModal.tsx";
import { useUI } from "../../sdk/useUI.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

export interface UserData {
  data: { UserAttributes: { Name: string; Value: string }[] };
  dataProfile: Omit<UpdateDataProps, "name cpf address"> & {
    address: UpdateDataProps["address"][];
    created_at?: Date;
    association: { name: string; logo_url: string };
    qrcode_url: string;
    ecannacard_url?: string;
    credit_cards: SavedCreditCard[];
  };
}

export interface Props {
  cardSkeleton: ImageWidget;
}

function EcannaCardPage({ cardSkeleton }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [cardUrl, setCardUrl] = useState<string>();
  const [address, setAddress] = useState<Address>();
  const [creditCards, setCreditCards] = useState<SavedCreditCard[]>([]);
  const [cardProduct, setCardProduct] = useState<Product>({} as Product);
  const { displayCheckoutUpsellModal } = useUI();

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

          setLoadingProduct(true);

          const cardsResponse = await invoke["deco-sites/ecannadeco"].actions
            .getCardProduct();

          setLoadingProduct(false);

          const cardProducts = cardsResponse as { docs: Product[] };
          console.log({ cardProducts });
          setCardProduct(cardProducts.docs[0]);

          setCardUrl(res.dataProfile.ecannacard_url);

          setCreditCards(res.dataProfile.credit_cards);

          setIsLoading(false);
        });
    } catch (e) {
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
      <div class="rotate-90 sm:rotate-0 flex justify-center p-3 sm:p-12 bg-[#252525] rounded-xl max-w-[424px] sm:max-w-[90%]">
        {(cardUrl && !isLoading)
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
              {isLoading
                ? (
                  <span class="text-white">
                    <Loading style="loading-spinner" size="loading-md" />
                  </span>
                )
                : (
                  <span class="text-white">
                    Este usuário não possui carteirinha. Atualize seus dados de
                    paciente na página de "Meus Dados".
                  </span>
                )}
            </div>
          )}
      </div>
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-[4%] max-w-[90%]">
        <CheckoutUpsellModal
          creditCards={creditCards}
          product={cardProduct}
          address={address!}
        />
        <button
          type="button"
          href={cardUrl}
          class="flex btn btn-primary text-white w-full sm:w-[48%]"
          onClick={() => {
            downloadFile(cardUrl!, "carteirinha-ecanna.png");
          }}
        >
          <span>Baixar Carteirinha</span> <Icon id="Download" size={19} />
        </button>
        <button
          type="button"
          download="carteirinha.png"
          class="flex btn btn-primary text-white w-full sm:w-[48%]"
          onClick={() => displayCheckoutUpsellModal.value = true}
        >
          <div class="flex items-center">
            <span>Nova Via Física</span> {loadingProduct
              ? <Loading style="loading-spinner" size="loading-xs" />
              : (
                <div class="p-2 bg-white text-primary text-xs rounded-md">
                  {"R$" + (cardProduct.price / 100).toFixed(2)}
                </div>
              )}
          </div>
        </button>
      </div>
    </div>
  );
}

export default EcannaCardPage;
