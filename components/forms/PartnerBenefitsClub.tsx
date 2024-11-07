// import Image from "apps/website/components/Image.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";

export interface Props {
  ecannaLogo: ImageWidget;
  title: string;
  description?: string;
}

// Make it sure to render it on the server only. DO NOT render it on an island
function PartnerBenefitsClub({
  ecannaLogo,
  title,
  description,
}: // partnerAssociations,
Props) {
  const [companyName, setCompanyName] = useState("");
  const [companyPerson, setCompanyPerson] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [benefitDescription, setBenefitDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    const body = {
      companyName,
      companyPerson,
      whatsapp,
      benefitDescription,
      productDescription,
    };

    invoke["deco-sites/ecannadeco"].actions
      .sendEmailInterestedPartner(body)
      .then((_r) => {
        setSuccess(true);
        setLoading(false);
      });
  };

  return (
    <div
      class="container rounded-lg max-w-[90%] bg-cover"
      style={`background-image: url('https://deco-sites-assets.s3.sa-east-1.amazonaws.com/ecannadeco/e156e789-2b46-4eab-a904-04ce76e49f81/bg_benefits.png');`}
    >
      <div class="container  flex-col md:flex-row flex py-8 gap-y-8">
        <div class="flex flex-col gap-y-8 px-8 text-white md:max-w-[50%] justify-center items-center sm:items-start">
          <div class="flex flex-col gap-8">
            <Image
              class="object-contain"
              src={ecannaLogo}
              width={150}
              alt="banner image"
            />
            <span
              class="text-3xl lg:text-5xl font-bold "
              style={{ lineHeight: "66px" }}
            >
              {title}
            </span>
          </div>
          <span class=" text-sm">{description}</span>
        </div>
        <div class="flex w-full md:w-[50%] justify-center p-3">
          <div class="bg-white flex flex-col gap-3 rounded-md w-full p-4 px-8 max-w-[420px]">
            <label class="form-control w-full mb-2">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Nome da Empresa
                </span>
              </div>
              <input
                placeholder="Empresa tal"
                class="input rounded-md text-[#8b8b8b] w-full disabled:bg-[#e3e3e3]"
                name="name"
                value={companyName}
                onChange={(e) => setCompanyName(e.currentTarget.value)}
              />
            </label>
            <label class="form-control w-full mb-2">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Responsável / Seu nome
                </span>
              </div>
              <input
                placeholder="Nome aqui"
                class="input rounded-md text-[#8b8b8b] w-full disabled:bg-[#e3e3e3]"
                name="name"
                value={companyPerson}
                onChange={(e) => setCompanyPerson(e.currentTarget.value)}
              />
            </label>
            <label class="form-control w-full mb-2">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Nome da Empresa
                </span>
              </div>
              <input
                placeholder="(00) 00000-0000"
                class="input rounded-md text-[#8b8b8b] w-full disabled:bg-[#e3e3e3]"
                name="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.currentTarget.value)}
              />
            </label>
            <label class="form-control w-full mb-2">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Descrição do produto/serviço
                </span>
              </div>
              <input
                placeholder="O que sua empresa faz"
                class="input rounded-md text-[#8b8b8b] w-full disabled:bg-[#e3e3e3]"
                name="whatsapp"
                value={productDescription}
                onChange={(e) => setProductDescription(e.currentTarget.value)}
              />
            </label>
            <label class="form-control w-full mb-2">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Descrição do Benefício
                </span>
              </div>
              <input
                placeholder="Benefício a ser oferecido"
                class="input rounded-md text-[#8b8b8b] w-full disabled:bg-[#e3e3e3]"
                name="whatsapp"
                value={benefitDescription}
                onChange={(e) => setBenefitDescription(e.currentTarget.value)}
              />
            </label>
            <button
              class="btn bg-[#004B7E] text-white rounded-full w-full"
              onClick={handleSubmit}
            >
              {loading
                ? "Enviando..."
                : success
                ? "Enviado com Sucesso!"
                : "Enviar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerBenefitsClub;
