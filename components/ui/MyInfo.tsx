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

function MyInfo() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCids, setIsLoadingCids] = useState(false);
  const [isLoadingPostalCode, setIsLoadingPostalCode] = useState(false);
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [termsAgree, setTermsAgree] = useState(false);
  const [authorization, setAuthorization] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressNeighborhood, setAddressNeighborhood] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [addressComplement, setAddressComplement] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [cidSearchTerm, setCidSearchTerm] = useState("");
  const [cidSearchResponse, setCidSearchResponse] = useState<unknown[]>([]);
  const [cids, setCids] = useState<unknown[]>([]);
  const [userImg, setUserImg] = useState<string | null>(null);
  const [displayCidResults, setDisplayCidResults] = useState(false);

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    const accessToken = localStorage.getItem("AccessToken") || "";
    setAuthorization(accessToken);

    if (accessToken === "") {
      window.location.href = "/";
    }

    try {
      setIsLoading(true);

      invoke["deco-sites/ecannadeco"].actions.getUser({
        token: accessToken,
      }).then((r) => {
        const res = r as {
          data: { UserAttributes: { Name: string; Value: string }[] };
          dataProfile:
            & Omit<UpdateDataProps, "name cpf address">
            & {
              address: UpdateDataProps["address"][];
            };
        };
        const userName = res.data.UserAttributes.find((a) =>
          a["Name"] === "name"
        );
        const userCpf = res.data.UserAttributes.find((a) =>
          a["Name"] === "custom:cpfcnpj"
        );

        setName(userName?.Value || "NOME NÃO CADASTRADO");
        setCpf(userCpf?.Value || "CPF NÃO CADASTRADO");

        const address = res.dataProfile.address[0];

        setPostalCode(address.cep);
        setAddressStreet(address.street);
        setAddressNeighborhood(address.neighborhood);
        setAddressNumber(address.number);
        setAddressComplement(address.complement);
        setCids(res.dataProfile.cids);
        setUserImg(res.dataProfile.avatar_photo);

        console.log({ r });
        setIsLoading(false);
      });
    } catch (e) {
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
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "selfie_photo");

      try {
        const response = await fetch("http://localhost:3000/files", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: localStorage.getItem("AccessToken") || "",
            ContentType: "multipart/form-data",
          },
        });
        const r = await response.json();

        setUserImg(r.url);
      } catch (e) {
        console.log({ e });
      }
    }
  };

  const handleSearchCids = (term: string) => {
    try {
      setIsLoadingCids(true);
      invoke["deco-sites/ecannadeco"].actions.getCids({
        term,
        token: authorization,
      }).then((r) => {
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
      setAddressCity(r.localidade + "/" + r.uf);
      setAddressNeighborhood(r.bairro);
      setIsLoadingPostalCode(false);
    } catch (e) {
      setIsLoadingPostalCode(false);

      console.log({ e });
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    if (!termsAgree) {
      alert(
        "Aceite o termo de responsabilidade antes de atualizar seus dados.",
      );
      setIsSubmitting(false);
      return null;
    }

    const idsCids = cids.map((c) => {
      const cid = c as { _id: string };
      return cid._id;
    });

    const body: UpdateDataProps = {
      token: localStorage.getItem("AccessToken") || "no_token",
      avatar_photo: userImg || "no_img",
      name,
      cpf,
      cids: idsCids,
      address: {
        cep: postalCode,
        street: addressStreet,
        number: addressNumber,
        complement: addressComplement,
        neighborhood: addressNeighborhood + ", " + addressCity,
        addressType: "BILLING",
      },
    };

    try {
      invoke["deco-sites/ecannadeco"].actions.updateUserData(body).then(
        (r) => {
          setIsSubmitting(false);
          invoke["deco-sites/ecannadeco"].actions.updateProfile({
            token: localStorage.getItem("AccessToken") || "",
            body: { updatedData: true },
          }).then(
            (res) => {
              window.location.href = window.location.pathname;
            },
          );
        },
      );
    } catch (e) {
      alert("Houve um erro ao atualizar os dados: ");
      console.log({ e });
      setIsSubmitting(false);
    }
  };

  return (
    isLoading
      ? <span class="loading loading-spinner text-green-600"></span>
      : (
        <div>
          <h3>Meus Dados</h3>
          <div>
            {/* Perosnal Info */}
            <h2>Dados Pessoais</h2>
            {/* Selfie */}
            <div>
              {!userImg
                ? (
                  <div class="h-[144px] w-[108px] bg-slate-500 flex justify-center items-center">
                    <span class="text-white font-medium">
                      Faça o upload da sua foto
                    </span>
                  </div>
                )
                : (
                  <div class="h-[144px] w-[108px]flex justify-center items-center">
                    <Image
                      src={userImg}
                      alt={"user selfie"}
                      width={108}
                      height={144}
                    />
                  </div>
                )}
              <input
                type="file"
                class="file-input file-input-bordered file-input-xs w-full max-w-xs"
                onChange={(e) => handleUploadSelfie(e)}
              />
            </div>

            <div class="flex gap-5">
              <label class="input input-bordered flex items-center gap-2">
                Nome
                <input
                  placeholder="Nome"
                  name="name"
                  disabled={name ? true : false}
                  value={name}
                  // onFocus={() => setDisplayCidResults(true)}
                  // onBlur={() => setDisplayCidResults(false)}
                />
              </label>
              <label class="input input-bordered flex items-center gap-2">
                CPF
                <input
                  placeholder="CPF"
                  name="cpf"
                  disabled={cpf ? true : false}
                  value={cpf}
                  // onFocus={() => setDisplayCidResults(true)}
                  // onBlur={() => setDisplayCidResults(false)}
                />
              </label>
            </div>

            {/* Adrress */}
            <h2>Endereço Residencial - Também usado para entregas</h2>
            <div class="join">
              <label class="input input-bordered flex items-center gap-2 join-item">
                CEP
                <input
                  placeholder="CEP"
                  name="cep"
                  disabled={addressStreet != "" ? true : false}
                  value={postalCode}
                  onChange={(e) => {
                    setPostalCode(e.currentTarget.value);
                  }}
                  // onFocus={() => setDisplayCidResults(true)}
                  // onBlur={() => setDisplayCidResults(false)}
                />
              </label>
              <button
                class="btn btn-secondary join-item"
                onClick={() => handleValidatePostalCode(postalCode)}
              >
                Validar CEP{" "}
                {isLoadingPostalCode && (
                  <span class="loading loading-spinner text-green-600"></span>
                )}
              </button>
            </div>

            <div class={addressStreet !== "" ? "" : "hidden"}>
              <label>
                <div class="label">
                  <span class="label-text">Logradouro</span>
                </div>
                <input
                  class="input input-ghost"
                  placeholder="logradouro"
                  name="cep"
                  disabled
                  value={addressStreet}
                />
              </label>
              <label>
                <div class="label">
                  <span class="label-text">Número*</span>
                </div>
                <input
                  class="input input-bordered"
                  placeholder="número"
                  name="cep"
                  value={addressNumber}
                  onChange={(e) => {
                    setAddressNumber(e.currentTarget.value);
                  }}
                />
              </label>
              <label>
                <div class="label">
                  <span class="label-text">Complemento (casa, ap, etc)</span>
                </div>
                <input
                  class="input input-bordered"
                  placeholder="complemento"
                  name="cep"
                  value={addressComplement}
                  onChange={(e) => {
                    setAddressComplement(e.currentTarget.value);
                  }}
                />
              </label>
              <label>
                <div class="label">
                  <span class="label-text">Bairro - cidade/uf</span>
                </div>
                <input
                  class="input input-ghost w-full"
                  placeholder="Bairro - cidade/uf"
                  name="localidade"
                  disabled
                  value={`${addressNeighborhood} - ${addressCity}`}
                />
              </label>
            </div>

            {/* CIDs */}
            <h2>Selecione seus CIDs</h2>
            <div class="join flex flex-col">
              <input
                placeholder="Pesquise seus CIDs"
                class="input input-bordered join-item"
                name="cids"
                value={cidSearchTerm}
                onChange={(e) => {
                  setCidSearchTerm(e.currentTarget.value);
                  handleSearchCids(e.currentTarget.value);
                }}
                // onFocus={() => setDisplayCidResults(true)}
                // onBlur={() => setDisplayCidResults(false)}
              />
              <div class={`join-item`}>
                <ul>
                  {cidSearchResponse.slice(0, 5).map((c) => {
                    const cid = c as {
                      full_code: string;
                      name: string;
                      _id: string;
                    };
                    return (cid.name != "" && (
                      <li
                        class="cursor-pointer"
                        onClick={() => {
                          setCids([...cids, cid]);
                        }}
                      >
                        {cid.full_code} - {cid.name}
                      </li>
                    ));
                  })}
                </ul>
              </div>
              <div>
                {cids.map((c) => {
                  const cid = c as { full_code: string; name: string };
                  return (
                    <div class="badge badge-success gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        class="inline-block w-4 h-4 stroke-current"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        >
                        </path>
                      </svg>
                      {cid.full_code} - {cid.name}
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
                class="checkbox checkbox-xs border-white"
                onChange={(e) => {
                  setTermsAgree(e.currentTarget.checked);
                }}
              />
              <span class="label-text text-xs text-black">
                Declaro, sob minha responsabilidade, que todas as informações
                inseridas neste formulário são verdadeiras
              </span>
            </label>
          </div>
          <button class="btn btn-primary" onClick={handleSubmit}>
            Salvar Dados
          </button>
        </div>
      )
  );
}

export default MyInfo;
