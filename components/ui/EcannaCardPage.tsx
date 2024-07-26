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
import { useUI } from "../../sdk/useUI.ts";
import { useHolderInfo } from "deco-sites/ecannadeco/sdk/useHolderInfo.ts";

export interface UserData {
  data: { UserAttributes: { Name: string; Value: string }[] };
  dataProfile: Omit<UpdateDataProps, "name cpf address"> & {
    address: UpdateDataProps["address"][];
    created_at?: Date;
    plan: string;
    associationApproved?: boolean;
    association: { name: string; logo_url: string; cnpj: string };
    qrcode_url: string;
    credit_cards: SavedCreditCard[];
    ecannacard_url: string;
    _id: string;
    pin: string;
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
  const [_association, setAssociation] = useState<{
    name: string;
    logo_url: string;
    cnpj: string;
  }>();
  const [pin, setPin] = useState("");
  const [updatingPin, setUpdatingPin] = useState(false);
  const [_qrcode, setQrcode] = useState<string>();
  const [creditCards, setCreditCards] = useState<SavedCreditCard[]>([]);
  const [cardProduct, setCardProduct] = useState<Product>({} as Product);

  const { displayCheckoutUpsellModal } = useUI();
  const holderInfo = useHolderInfo();

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
          const date = res.dataProfile?.created_at;
          const associationObj = res.dataProfile?.association;
          const qr = res.dataProfile?.qrcode_url;

          holderInfo.value = {
            email: res.data.UserAttributes.find((a) =>
              a.Name === "email"
            )?.Value ||
              "",
            phone: res.dataProfile.phone,
            full_name: res.dataProfile.name,
            birth_date: res.dataProfile.birth_date,
            cpf_cnpj: res.dataProfile.cpf,
            postal_code: res.dataProfile.address[0].cep,
            address_number: res.dataProfile.address[0].number,
            address_complement: res.dataProfile.address[0].complement,
            address_city: res.dataProfile.address[0].city,
            address_state: res.dataProfile.address[0].state,
            address_street: res.dataProfile.address[0].street,
          };

          setUserData(res);
          setAssociation(associationObj);
          setQrcode(qr);
          setCreatedAt(new Date(String(date)));
          setPin(res.dataProfile.pin);

          setLoadingProduct(true);

          const cardsResponse = await invoke[
            "deco-sites/ecannadeco"
          ].actions.getCardProduct({
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

  const updateUserPin = async () => {
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
    }
    setUpdatingPin(true);

    try {
      await invoke["deco-sites/ecannadeco"].actions.updateUserPin({
        pin,
        token: accessToken,
      });
    } catch (e) {
      console.log({ e });
      alert("erro ao atualizar pin. Contacte o suporte!");
    }

    setUpdatingPin(false);
  };

  return (
    <div class="flex flex-col justify-center items-center my-10 gap-[30px]">
      <div class="flex flex-wrap gap-4 items-center justify-center my-4 mb-10">
        <a href="/meus-dados" class="btn btn-secondary btn-xs text-white">
          <Icon id="UserData" size={19} /> Dados de Paciente
        </a>
        <a href="/meus-documentos" class="btn btn-secondary btn-xs text-white">
          <Icon id="Folder" size={19} /> Meus Documentos
        </a>
        <a
          href={`/ficha/${userData?.dataProfile?._id}`}
          class={`btn btn-secondary btn-xs text-white ${
            userData?.dataProfile?.association &&
            !userData?.dataProfile?.associationApproved &&
            "hidden"
          }`}
        >
          <Icon id="Form" size={19} /> Ficha Pública
        </a>
      </div>
      <div class="rotate-90 sm:rotate-0 flex justify-center p-3 sm:p-12 bg-[#252525] rounded-xl max-w-[424px] sm:max-w-[90%] text-[#1878b8]">
        {isLoading
          ? <span class="loading loading-spinner loading-xs" />
          : (
            <div id="ecannaCard" class="relative text-[#1878b8]">
              {userData?.dataProfile?.association &&
                  !userData?.dataProfile?.associationApproved
                ? (
                  <div class="w-[352px] h-[234px] bg-white rounded-md flex justify-center items-center p-10 text-center">
                    <span class="text-black uppercase">
                      Estamos aguardando a associação confirmar sua identidade
                      para liberar a carteirinha! Em breve, sua carteirinha
                      estará disponível!
                    </span>
                  </div>
                )
                : (
                  <Image
                    class="card"
                    src={userData?.dataProfile?.ecannacard_url || cardSkeleton}
                    alt="Carteirinha eCanna"
                    width={352}
                    height={234}
                    loading="lazy"
                  />
                )}
            </div>
          )}
      </div>
      <div>
        <div class="join w-full">
          <label class="join-item">
            {
              /* <div class="label pb-1">
              <span class="label-text text-xs text-[#585858]">CEP</span>
            </div> */
            }
            <input
              placeholder="PIN"
              name="pin"
              maxLength={4}
              class="input input-xs rounded-md rounded-r-none text-[#8b8b8b] border border-[#ececec]"
              value={pin}
              disabled={updatingPin}
              onChange={(e) => e.target && setPin(e.currentTarget.value)}
            />
            <button
              class="btn btn-ghost btn-xs bg-secondary text-white join-item"
              type="button"
              onClick={updateUserPin}
            >
              Atualizar PIN{" "}
              {updatingPin && (
                <span class="loading loading-spinner text-green-600"></span>
              )}
            </button>
          </label>
        </div>
      </div>
      <div class="max-w-[472px] w-[90%] mt-10 sm:mt-0">
        <div class="bg-[#ececec] p-4 rounded-md">
          <span class="text-xs">
            O envio de nova via física de carteirinha leva até 7 dias úteis
            (tempo de produção). Você pode acompanhar seu pedido de nova via
            física pela página de{" "}
            <a class="underline" href="/meus-pedidos">
              meus pedidos
            </a>
          </span>
        </div>
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
              disabled={userData?.dataProfile?.association &&
                !userData?.dataProfile?.associationApproved}
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
          disabled={userData?.dataProfile?.association &&
            !userData?.dataProfile?.associationApproved}
          download="carteirinha.png"
          class="flex btn btn-primary text-white w-full sm:w-[48%]"
          onClick={() => {
            displayCheckoutUpsellModal.value = true;
            console.log({
              displayCheckoutUpsellModal: displayCheckoutUpsellModal.value,
            });
          }}
        >
          <div class="flex items-center gap-2">
            <span class="w-32">Pedir Via Física</span> {loadingProduct
              ? <Loading style="loading-spinner" size="loading-xs" />
              : (
                <div class="p-2 bg-white text-primary text-xs rounded-md">
                  {cardProduct.price == 0
                    ? "Grátis"
                    : "R$" + (cardProduct.price / 100).toFixed(2)}
                </div>
              )}
          </div>
        </button>
      </div>
    </div>
  );
}

export default EcannaCardPage;
