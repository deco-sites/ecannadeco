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
import domtoimage from "dom-to-image";
// import puppeteer from "puppeteer";

export interface UserData {
  data: { UserAttributes: { Name: string; Value: string }[] };
  dataProfile: Omit<UpdateDataProps, "name cpf address"> & {
    address: UpdateDataProps["address"][];
    created_at?: Date;
    association: { name: string; logo_url: string };
    qrcode_url: string;
    credit_cards: SavedCreditCard[];
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
  const [isLoading, setIsLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [userData, setUserData] = useState<UserData>();
  const [created_at, setCreatedAt] = useState<Date>();
  const [association, setAssociation] = useState<
    { name: string; logo_url: string }
  >();
  const [qrcode, setQrcode] = useState<string>();
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
            .getCardProduct();

          setLoadingProduct(false);

          const cardProducts = cardsResponse as { docs: Product[] };

          setCardProduct(cardProducts.docs[0]);

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

  function generateCardImage() {
    setDownloading(true);
    const element = document.getElementById("ecannaCard");

    if (element) {
      // const browser = await puppeteer.launch({});
      // const page = await browser.newPage();
      // await page.setContent(element.outerHTML);
      // const screenshotBuffer = await page.screenshot({
      //   clip: { x: 0, y: 0, width: 395, height: 260 },
      // });
      // await browser.close();

      // const blob = new Blob([screenshotBuffer], { type: 'image/png' });
      // const url = URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = ;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // URL.revokeObjectURL(url);

      domtoimage.toPng(element)
        .then(function (dataUrl1) {
          domtoimage.toPng(element)
            .then(function (dataUrl2) {
              domtoimage.toPng(element)
                .then(function (dataUrl3) {
                  console.log({ dataUrl1 });
                  const link = document.createElement("a");
                  link.download = "my-image-name.png";
                  link.href = dataUrl1;
                  setDownloading(false);
                  link.click();
                });
            });
        })
        .catch(function (error) {
          setDownloading(false);
          console.error("Oops, something went wrong!", error);
        });
    } else {
      setDownloading(false);
      alert("Erro ao gerar carteirinha. Contacte o suporte!");
    }
  }

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
              {userData && (
                <div class="absolute z-10 top-[68px] left-[30px]">
                  <Image
                    class="rounded-md"
                    src={userData.dataProfile.avatar_photo}
                    alt={"user selfie"}
                    width={78}
                    height={104}
                  />
                </div>
              )}
              {userData && (
                <div class="absolute z-10 flex flex-col top-[65px] left-[122px]">
                  <span class="font-semibold text-lg">
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
                    {userData.dataProfile.address && (
                      <span>
                        {userData.dataProfile.address[0].city + " / " +
                          userData.dataProfile.address[0].state}
                      </span>
                    )}
                  </span>
                </div>
              )}
              {association && (
                <div class="absolute z-10 top-[185px] left-[130px]">
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
                <div class="absolute z-10 top-[137px] left-[259px] bg-[#262626] rounded-md p-2">
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
                <div class="absolute z-10 flex flex-col top-[187px] left-[65px] items-start">
                  <span class="text-[10px]">
                    Emissão
                  </span>
                  <span class="text-[10px]">
                    {formatDate(created_at)}
                  </span>
                </div>
              )}

              <Image
                class="card"
                src={cardSkeleton}
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
        <button
          type="button"
          class="flex btn btn-primary text-white w-full sm:w-[48%]"
          onClick={() => {
            // generateCardImage();
            alert("Funcionalidade em Desenvolvimento! Lançaremos em Breve");
          }}
        >
          <span>Baixar Carteirinha</span> {downloading
            ? <span class="loading loading-spinner loading-xs" />
            : <Icon id="Download" size={19} />}
        </button>
        <button
          type="button"
          download="carteirinha.png"
          class="flex btn btn-primary text-white w-full sm:w-[48%]"
          // onClick={() => displayCheckoutUpsellModal.value = true}
          onClick={() =>
            alert("Funcionalidade em Desenvolvimento! Lançaremos em Breve")}
        >
          <div class="flex items-center gap-2">
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
