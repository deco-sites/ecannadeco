/**
 * This component was made to control if user is logged in to access pages
 */
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import PageWrap from "./PageWrap.tsx";
import PatientCard from "./PatientCard.tsx";
import Icon from "./Icon.tsx";
import { useUI } from "../../sdk/useUI.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import PrescriberNewPatientModal from "../../islands/PrescriberNewPatientModalLive.tsx";
import ModalTextAction from "./ModalTextAction.tsx";
import ModalVideo from "deco-sites/ecannadeco/components/ui/ModalVideo.tsx";

export type Address = {
  cep: string;
  number: string;
  complement: string;
  addressType: string;
};

export type Entry = {
  created_at: string;
  desiredEffects: {
    effect: {
      name: string;
    };
    intensity: number;
  }[];
  undesiredEffects: {
    effect: {
      name: string;
    };
    intensity: number;
  }[];
};

export type Treatment = {
  _id: string;
  updated_at: string;
  status?: "NEUTRAL" | "GOOD" | "BAD";
  medications: {
    name: string;
    dosage: string;
  }[];
  isActive: boolean;
  prescriber?: {
    _id: string;
    name: string;
    registry_type: string;
    registry_state: string;
    registry_number: string;
  };
  patient?: {
    _id: string;
    name: string;
  };
  prescription?: File;
};

export type Patient = {
  _id: string;
  name: string;
  profile: {
    email: string;
  };
  lastReport?: string | Date;
  status?: string;
};

function PrescriberPatients() {
  const [isLoading, _setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [emailSearch, setEmailSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [page, setPage] = useState<number | null>(1);
  const [totalPages, setTotalPages] = useState<number | null>(1);
  const [totalDocs, setTotalDocs] = useState<number | null>(1);

  const getPatients = async (
    accessToken: string,
    search?: string,
    page?: number,
  ) => {
    setIsLoadingUsers(true);
    const response = await invoke[
      "deco-sites/ecannadeco"
    ].actions.prescriberGetPatients({
      token: accessToken,
      search,
      page: page || 1,
    });
    setIsLoadingUsers(false);
    if (response) {
      setPatients(response.docs as Patient[]);
      setPage(response.page);
      setTotalPages(response.totalPages);
      setHasNextPage(response.hasNextPage);
      setHasPrevPage(response.hasPrevPage);
      setTotalDocs(response.totalDocs);
    }
  };

  const getPrescriber = async (accessToken: string) => {
    const response = await invoke["deco-sites/ecannadeco"].actions
      .getUserPrescriber({
        token: accessToken,
      })
      .then((r) => {
        const res = r as {
          plan: string;
          isExpiredTrial: boolean;
        };

        if (res.plan === "DEFAULT" && res.isExpiredTrial) {
          alert(
            "Seu tempo de acesso gratuito expirou! Selecione um plano para continuar.",
          );
          window.location.href = "/prescritor/minha-conta";
        }
      });
    return response;
  };

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("PrescriberAccessToken") || "";
    }

    if (accessToken === "") {
      window.location.href = "/";
    }

    try {
      getPatients(accessToken);
      getPrescriber(accessToken);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      if (IS_BROWSER) {
        localStorage.setItem("AccessToken", "");
      }
      window.location.href = "/";
    }
  }, []);

  const { displayNewPatientModal, displayModalTextAction, displayVideoModal } =
    useUI();

  return (
    <>
      <div class="w-full flex justify-center mb-4">
        <div class="flex justify-between w-[90%] max-w-[800px]">
          <button
            class="btn btn-sm btn-ghost text-[#b0b0b0]"
            onClick={() => window.history.back()}
          >
            <Icon id="GoBack" size={19} />
          </button>
          <button
            class="btn btn-xs bg-[#d8d8d8] text-[#8c8c8c] border-none rounded-full"
            onClick={() => (displayVideoModal.value = true)}
          >
            <Icon id="Help" size={19} />
            Como Funciona?
          </button>
        </div>
      </div>
      <PageWrap>
        {isLoading
          ? <span class="loading loading-spinner text-green-600"></span>
          : (
            <div class="flex flex-col gap-3 w-full">
              <ModalVideo
                open={displayVideoModal.value}
                onClose={() => (displayVideoModal.value = false)}
                title="Prescritor - Como usar?"
                videoURL="https://www.youtube.com/embed/jCUQwbZsWrk?si=eVBWz87A8L4atM0j"
              />
              <div class="flex flex-col items-center justify-center gap-1">
                <h3 class="text-2xl text-[#8b8b8b] text-center mb-8">
                  Meus Pacientes
                </h3>
              </div>
              <div class="flex flex-col sm:flex-row gap-4 justify-between mb-4">
                <PrescriberNewPatientModal
                  onFinished={() => {
                    displayNewPatientModal.value = false;
                    let accessToken = "";
                    if (IS_BROWSER) {
                      accessToken =
                        localStorage.getItem("PrescriberAccessToken") || "";
                    }
                    getPatients(accessToken);
                  }}
                />
                <input
                  placeholder="Pesquise por email ou nome"
                  class="input rounded-full text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3] sm:w-1/2 h-[35px] text-xs"
                  name="emailSearch"
                  value={emailSearch}
                  onChange={(e) => {
                    let accessToken = "";
                    if (IS_BROWSER) {
                      accessToken =
                        localStorage.getItem("PrescriberAccessToken") || "";
                    }
                    setEmailSearch(e.currentTarget.value);
                    if (e.currentTarget.value.length >= 3) {
                      getPatients(accessToken, e.currentTarget.value);
                    }
                    if (e.currentTarget.value.length === 0) {
                      getPatients(accessToken);
                    }
                  }}
                />
                <ModalTextAction
                  onClose={() => (displayModalTextAction.value = false)}
                  buttonText="Fazer Upgrade"
                />
                <div class="flex justify-end">
                  <button
                    class="btn btn-sm btn-secondary text-white"
                    onClick={() => {
                      displayNewPatientModal.value = true;
                    }}
                  >
                    <Icon id="UserData" size={19} />
                    Novo Paciente
                  </button>
                </div>
              </div>
              {isLoadingUsers
                ? <span class="loading loading-spinner text-green-600"></span>
                : (
                  <ul class="flex flex-col gap-4">
                    <li class="text-xs">
                      {totalDocs} paciente{totalDocs === 1 ? "" : "s"}{" "}
                      encontrado
                      {totalDocs === 1 ? "" : "s"}
                    </li>
                    {patients.length === 0 && (
                      <>
                        <div class="flex justify-center">
                          <span class="text-[#8b8b8b]">
                            Você não tem nenhum paciente cadastre o primeiro
                          </span>
                        </div>
                        <button
                          class="btn btn-sm btn-secondary text-white flex"
                          onClick={() => {
                            displayNewPatientModal.value = true;
                          }}
                        >
                          <Icon id="UserData" size={19} />
                          Novo Paciente
                        </button>
                      </>
                    )}
                    <div class="flex justify-between"></div>
                    {patients &&
                      patients.map((p) => {
                        return <PatientCard patient={p} />;
                      })}
                  </ul>
                )}
              <div class="flex justify-center mt-4">
                <div>
                  {hasPrevPage && (
                    <span
                      class="p-4 cursor-pointer"
                      onClick={() => {
                        let accessToken = "";

                        if (IS_BROWSER) {
                          accessToken =
                            localStorage.getItem("PrescriberAccessToken") || "";
                        }
                        getPatients(accessToken, undefined, page! - 1);
                      }}
                    >
                      {`<`}
                    </span>
                  )}
                </div>
                <div>
                  <span class="text-xs">{`Página ${page}/${totalPages}`}</span>
                </div>
                <div>
                  {hasNextPage && (
                    <span
                      class="p-4 cursor-pointer"
                      onClick={() => {
                        let accessToken = "";

                        if (IS_BROWSER) {
                          accessToken =
                            localStorage.getItem("PrescriberAccessToken") || "";
                        }
                        getPatients(accessToken, undefined, page! + 1);
                      }}
                    >
                      {`>`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
      </PageWrap>
    </>
  );
}

export default PrescriberPatients;
