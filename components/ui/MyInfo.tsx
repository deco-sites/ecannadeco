/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import Image from "apps/website/components/Image.tsx";
import { h } from "preact";
import { Props as UpdateDataProps } from "../../actions/updateUserData.ts";
import Icon from "../../components/ui/Icon.tsx";
import PageWrap from "../../components/ui/PageWrap.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

function MyInfo() {
  const [isLoading, setIsLoading] = useState(true);
  const [_isLoadingCids, setIsLoadingCids] = useState(false);
  const [isLoadingPostalCode, setIsLoadingPostalCode] = useState(false);
  const [uploadingSelfie, setUploadingSelfie] = useState(false);
  const [changedSelfie, setChangedSelfie] = useState(false);
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [termsAgree, setTermsAgree] = useState(false);
  const [authorization, setAuthorization] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressNeighborhood, setAddressNeighborhood] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [addressComplement, setAddressComplement] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [cidSearchTerm, setCidSearchTerm] = useState("");
  const [cidSearchResponse, setCidSearchResponse] = useState<unknown[]>([]);
  const [cids, setCids] = useState<unknown[]>([]);
  const [userImg, setUserImg] = useState<string | null>(null);
  const [profile, setProfile] = useState("");
  const [association, setAssociation] = useState<{
    name: string;
    logo_url: string;
    cnpj: string;
  }>();
  const [associationApproved, setAssociationApproved] = useState<boolean>();

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
      setAuthorization(accessToken);
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
              address: UpdateDataProps["address"][];
              associationApproved?: boolean;
              association: { name: string; logo_url: string; cnpj: string };
            };
          };

          setAssociation(res.dataProfile.association);
          setAssociationApproved(res.dataProfile.associationApproved);

          const userName = res.data.UserAttributes.find(
            (a) => a["Name"] === "name",
          );
          const userCpf = res.data.UserAttributes.find(
            (a) => a["Name"] === "custom:cpfcnpj",
          );

          setName(userName?.Value || "NOME NÃO CADASTRADO");
          setCpf(userCpf?.Value || "CPF NÃO CADASTRADO");
          setBirthDate((res.dataProfile.birth_date || "").slice(0, 10));

          setPhone(res.dataProfile.phone);
          setProfile(res.dataProfile._id);

          const address = res.dataProfile.address[0];

          if (address) {
            setPostalCode(address.cep);
            setAddressStreet(address.street);
            setAddressNeighborhood(address.neighborhood);
            setAddressCity(address.city);
            setAddressState(address.state);
            setAddressNumber(address.number);
            setAddressComplement(address.complement);
            setCids(res.dataProfile.cids);
            setUserImg(res.dataProfile.avatar_photo);
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

  const handleUploadSelfie = async (
    event: h.JSX.TargetedEvent<HTMLInputElement, Event>,
  ) => {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files && fileInput.files[0];
    let accessToken = "";

    setUploadingSelfie(true);

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
    }

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "selfie_photo");

      try {
        const response = await fetch("https://api.ecanna.com.br/files", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: accessToken,
            ContentType: "multipart/form-data",
          },
        });
        const r = await response.json();
        setUploadingSelfie(false);
        setChangedSelfie(true);
        setUserImg(r.url);
      } catch (e) {
        setUploadingSelfie(false);
        console.log({ e });
      }
    }
  };

  const handleSearchCids = (term: string) => {
    try {
      setIsLoadingCids(true);
      invoke["deco-sites/ecannadeco"].actions
        .getCids({
          term,
          token: authorization,
        })
        .then((r) => {
          const getCids = r as { docs: unknown[] };
          if (getCids.docs) {
            setCidSearchResponse(getCids.docs);
          }
          setIsLoadingCids(false);
        });
    } catch (e) {
      console.log({ e });
    }
  };

  const handleValidatePostalCode = async (code: string) => {
    setIsLoadingPostalCode(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${code}/json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const r = await response.json();

      setAddressStreet(r.logradouro);
      setAddressCity(r.localidade);
      setAddressState(r.uf);
      setAddressNeighborhood(r.bairro);
      setIsLoadingPostalCode(false);
    } catch (e) {
      setIsLoadingPostalCode(false);

      console.log({ e });
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
    }

    if (addressNumber == "" || addressComplement == "") {
      alert(
        "Complete as informações do endereço antes de atualizar seus dados.",
      );
      setIsSubmitting(false);
      return null;
    }

    if (!termsAgree) {
      alert(
        "Aceite o termo de responsabilidade antes de atualizar seus dados.",
      );
      setIsSubmitting(false);
      return null;
    }

    if (!userImg) {
      alert("Você deve subir uma foto 3x4 para continuar");
      setIsSubmitting(false);
      return null;
    }

    if (cids.length < 1) {
      alert("Insira pelo menos um diagnóstico (CID) para continuar");
      setIsSubmitting(false);
      return null;
    }

    const idsCids = cids.map((c) => {
      const cid = c as { _id: string };
      return cid._id;
    });

    const body: UpdateDataProps = {
      token: accessToken,
      avatar_photo: userImg || "no_img",
      birth_date: birthDate,
      name,
      cpf,
      phone,
      cids: idsCids,
      address: {
        cep: postalCode,
        street: addressStreet,
        number: addressNumber,
        city: addressCity,
        state: addressState,
        complement: addressComplement,
        neighborhood: addressNeighborhood,
        addressType: "BILLING",
      },
    };

    try {
      invoke["deco-sites/ecannadeco"].actions
        .updateUserData(body)
        .then((_r) => {
          setIsSubmitting(false);
          invoke["deco-sites/ecannadeco"].actions
            .updateProfile({
              token: accessToken,
              body: { updatedData: true },
            })
            .then((_res) => {
              setChangedSelfie(false);
              window.location.href = window.location.pathname;
            });
        });
    } catch (e) {
      alert("Houve um erro ao atualizar os dados: ");
      console.log({ e });
      setIsSubmitting(false);
    }
  };

  return isLoading
    ? <span class="loading loading-spinner text-green-600"></span>
    : (
      <PageWrap>
        <div class="flex flex-wrap gap-4 items-center justify-center my-4 mb-10">
          <a
            href="/meus-documentos"
            class="btn btn-secondary btn-xs text-white"
          >
            <Icon id="Folder" size={19} /> Meus Documentos
          </a>
          <a
            href="/minha-carteirinha"
            class="btn btn-secondary btn-xs text-white"
          >
            <Icon id="CardID" size={19} /> Minha Carteirinha
          </a>
          <a
            href={`/ficha/${profile}`}
            class={`btn btn-secondary btn-xs text-white ${
              association && !associationApproved && "hidden"
            }`}
          >
            <Icon id="Form" size={19} /> Ficha Pública
          </a>
        </div>
        <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center mb-10">
          Meus Dados de Paciente
        </h3>
        <div class="flex flex-col items-center">
          {/* Selfie */}
          <div class="flex flex-col items-center gap-4">
            <label for="selfieInput">
              <div class="relative h-[144px] w-[108px] shadow-md cursor-pointer">
                <div class="absolute h-7 w-7 flex justify-center items-center rounded-full bg-black bg-opacity-40 top-[10px] left-[71px]">
                  <div class="text-white">
                    <Icon id="Edit" size={12} />
                  </div>
                </div>
                <div class="h-[144px] w-[108px]flex justify-center items-center">
                  {uploadingSelfie
                    ? (
                      <span class="loading loading-spinner text-green-600">
                      </span>
                    )
                    : (
                      <Image
                        class="rounded-md"
                        src={userImg
                          ? userImg
                          : "http://drive.google.com/uc?export=view&id=1tSFTp0YZKVQVGJHOqzKaJw6SEe7Q8LL7"}
                        alt={"user selfie"}
                        width={108}
                        height={144}
                      />
                    )}
                </div>
              </div>
            </label>
            <input
              id="selfieInput"
              type="file"
              class="hidden"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => handleUploadSelfie(e)}
            />
            {changedSelfie && (
              <div class="px-2 bg-red-200 text-red-500 rounded-md">
                <span class="text-[10px]">
                  Para confirmar o uso desta foto, clique em "Salvar" no fim do
                  formulário
                </span>
              </div>
            )}
            <div class="bg-[#e3e3e3] rounded-md p-4 flex flex-col items-center gap-2 text-[10px] text-[#808080]">
              <span class="flex gap-2">
                <Icon id="Info" size={16} />
                Orientações para foto:
              </span>
              <ul class="list-decimal p-2">
                <li>
                  <span>Foto em proporção 3x4</span>
                </li>
                <li>
                  <span>Iluminação adequada, sem sombras</span>
                </li>
                <li>
                  <span>Fundo claro - preferencialmente branco</span>
                </li>
                <li>
                  <span>Rosto olhando para frente, direto para a câmera</span>
                </li>
                <li>
                  <span>Retire óculos, chapéus e demais adereços</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Personal info */}
          <h2 class="text-[#8b8b8b] font-semibold mb-1 mt-10 w-full">
            Dados Pessoais
          </h2>
          <div class="flex flex-wrap gap-[4%] w-full">
            <label class="form-control w-full sm:w-[48%]">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">Nome</span>
              </div>
              <input
                placeholder="Nome"
                class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                name="name"
                disabled={name ? true : false}
                value={name}
              />
            </label>
            <label class="w-full sm:w-[48%]">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">CPF</span>
              </div>
              <input
                placeholder="CPF"
                class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                name="cpf"
                disabled={cpf ? true : false}
                value={cpf.replace(
                  /(\d{3})(\d{3})(\d{3})(\d{2})/,
                  "$1.$2.$3-$4",
                )}
              />
            </label>
            <label class="w-full sm:w-[48%]  flex flex-col">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Data de Nascimento
                </span>
              </div>
              <input
                class="input rounded-md text-[#8b8b8b] border-none w-full"
                type="date"
                placeholder="Data de Nascimento"
                value={birthDate}
                onChange={(e) =>
                  e.target && setBirthDate(e.currentTarget.value)}
              />
            </label>
          </div>

          {/* Adrress */}
          <h2 class="text-[#8b8b8b] font-semibold mb-4 mt-10 w-full">
            Endereço e Contato
          </h2>
          <div class="flex flex-wrap gap-5 justify-left w-full">
            <div class="join">
              <label class="join-item">
                <div class="label pb-1">
                  <span class="label-text text-xs text-[#585858]">
                    CEP (apenas números)
                  </span>
                </div>
                <input
                  placeholder="CEP"
                  name="cep"
                  class="input rounded-md text-[#8b8b8b] border-none"
                  // disabled={addressStreet != "" ? true : false}
                  value={postalCode}
                  onChange={(e) => {
                    setPostalCode(e.currentTarget.value);
                  }}
                  // onFocus={() => setDisplayCidResults(true)}
                  // onBlur={() => setDisplayCidResults(false)}
                />
                <button
                  class="btn btn-ghost bg-[#dedede] text-[#5d5d5d] join-item"
                  onClick={() => handleValidatePostalCode(postalCode)}
                >
                  Validar CEP{" "}
                  {isLoadingPostalCode && (
                    <span class="loading loading-spinner text-green-600"></span>
                  )}
                </button>
              </label>
            </div>
            <div
              class={`flex flex-wrap gap-[2%] justify-left ${
                addressStreet !== "" ? "" : "hidden"
              }`}
            >
              <label class="w-full sm:w-[32%]">
                <div class="label pb-1">
                  <span class="label-text text-xs text-[#585858]">
                    Logradouro
                  </span>
                </div>
                <input
                  class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                  placeholder="logradouro"
                  name="cep"
                  disabled
                  value={addressStreet}
                />
              </label>
              <label class="w-full sm:w-[32%]">
                <div class="label pb-1">
                  <span class="label-text text-xs text-[#585858]">Número*</span>
                </div>
                <input
                  class="input rounded-md text-[#8b8b8b] border-none w-full"
                  placeholder="número"
                  name="cep"
                  value={addressNumber}
                  onChange={(e) => {
                    setAddressNumber(e.currentTarget.value);
                  }}
                />
              </label>
              <label class="w-full sm:w-[32%]">
                <div class="label pb-1">
                  <span class="label-text text-xs text-[#585858]">
                    Complemento (casa, ap, etc)
                  </span>
                </div>
                <input
                  class="input rounded-md text-[#8b8b8b] border-none w-full"
                  placeholder="complemento"
                  name="cep"
                  value={addressComplement}
                  onChange={(e) => {
                    setAddressComplement(e.currentTarget.value);
                  }}
                />
              </label>
              <label class="w-full sm:w-[32%]">
                <div class="label pb-1">
                  <span class="label-text text-xs text-[#585858]">
                    Cidade / Estado
                  </span>
                </div>
                <input
                  class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                  placeholder="Cidade / Estado"
                  name="cidadeestado"
                  disabled
                  value={`${addressCity + "/" + addressState}`}
                />
              </label>
              <div class="w-full sm:w-[32%]">
                <label class="w-full">
                  <div class="label pb-1">
                    <span class="label-text text-xs text-[#585858]">
                      Telefone
                    </span>
                  </div>
                  <input
                    class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                    placeholder="Telefone"
                    name="phone"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.currentTarget.value);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* CIDs */}
          <h2 class="text-[#8b8b8b] font-semibold mb-4 mt-10 w-full">
            CIDs (Diagnósticos)
          </h2>
          <div class="join flex flex-col w-full">
            <input
              placeholder="Pesquise e selecione seus CIDs"
              class="input rounded-md text-[#8b8b8b] border-none join-item mb-2"
              name="cids"
              value={cidSearchTerm}
              onChange={(e) => {
                setCidSearchTerm(e.currentTarget.value);
                handleSearchCids(e.currentTarget.value);
              }}
              // onFocus={() => setDisplayCidResults(true)}
              // onBlur={() => setDisplayCidResults(false)}
            />
            <div
              class={`join-item ${
                cidSearchResponse.length > 0 ? "" : "hidden"
              } `}
            >
              <ul class="flex flex-col gap-4 bg-white px-4 pb-4 pt-0 text-sm">
                {cidSearchResponse.slice(0, 5).map((c) => {
                  const cid = c as {
                    full_code: string;
                    name: string;
                    _id: string;
                  };
                  return (
                    cid.name != "" && (
                      <li
                        class="cursor-pointer"
                        onClick={() => {
                          if (
                            !cids.find(
                              (c) =>
                                (c as { full_code: string }).full_code ===
                                  cid.full_code,
                            )
                          ) {
                            setCids([...cids, cid]);
                          }
                        }}
                      >
                        {cid.full_code} - {cid.name}
                      </li>
                    )
                  );
                })}
              </ul>
            </div>
            <div>
              {cids.map((c, index) => {
                const cid = c as { full_code: string; name: string };
                return (
                  <div class="badge badge-secondary text-white gap-2 p-3 my-2 ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      class="inline-block w-4 h-4 stroke-current cursor-pointer"
                      onClick={() => {
                        const newCids = [...cids];
                        newCids.splice(index, 1);
                        setCids(newCids);
                      }}
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      >
                      </path>
                    </svg>
                    <span class="text-[10px] sm:text-sm truncate">
                      {cid.full_code} - {cid.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Responsability Agreement */}
          <label class="cursor-pointer label flex justify-start gap-2">
            <input
              type="checkbox"
              checked={termsAgree}
              class="checkbox checkbox-xs border-[#8b8b8b] bg-white"
              onChange={(e) => {
                setTermsAgree(e.currentTarget.checked);
              }}
            />
            <span class="label-text text-xs text-[#8b8b8b]">
              Declaro, sob minha responsabilidade, que todas as informações
              inseridas neste formulário são verdadeiras. E reconheço que estas
              informações serão disponibilizadas na minha ficha pública (quando
              lido o QR Code da carteirinha).
            </span>
          </label>
        </div>
        <div class="flex flex-col sm:flex-row justify-between mt-4 w-full gap-4">
          <button class="btn btn-primary" onClick={handleSubmit}>
            {isSubmiting ? "Salvando..." : "Salvar Dados"}
          </button>
        </div>
      </PageWrap>
    );
}

export default MyInfo;
