/**
 * This component was made to control if user is logged in to access pages
 */
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import PageWrap from "./PageWrap.tsx";
import Icon from "./Icon.tsx";
import { useUI } from "../../sdk/useUI.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { Patient, Treatment } from "./PrescriberPatientsLive.tsx";
import TreatmentCard from "./TreatmentCardLive.tsx";
import PrescriberUpdateTreatmentModal from "deco-sites/ecannadeco/islands/PrescriberUpdateTreatmentModalLive.tsx";
export type Address = {
  cep: string;
  number: string;
  complement: string;
  addressType: string;
};

function PrescriberPatientTreatments() {
  const [isLoading, setIsLoading] = useState(true);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [page, setPage] = useState<number | null>(1);
  const [totalPages, setTotalPages] = useState<number | null>(1);

  const [currentTreatment, setCurrentTreatment] = useState<Treatment | null>(
    null,
  );
  const [patient, setPatient] = useState<Patient | null>(null);

  const getPatient = async (accessToken: string, patientId: string) => {
    const patient = await invoke[
      "deco-sites/ecannadeco"
    ].actions.prescriberGetPatient({ token: accessToken, patientId });
    if (patient) {
      setPatient(patient as Patient);
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

  const getTreatmentsByPatient = async (
    accessToken: string,
    patientId: string,
    page: number = 1,
    isActive: boolean = false,
  ) => {
    setIsLoading(true);
    const response = await invoke[
      "deco-sites/ecannadeco"
    ].actions.prescriberGetTreatmentsByPatient({
      token: accessToken,
      patientId,
      page,
      isActive,
    });
    setIsLoading(false);
    if (response) {
      if (isActive) {
        setCurrentTreatment(response.docs[0] as Treatment);
        if (!response.docs[0]) {
          displayNewTreatmentModal.value = true;
        }
      } else {
        setHasNextPage(response.hasNextPage);
        setHasPrevPage(response.hasPrevPage);
        setPage(response.page);
        setTotalPages(response.totalPages);
        setTreatments(response.docs as Treatment[]);
      }
    }
  };

  useEffect(() => {
    const accessToken = IS_BROWSER
      ? localStorage.getItem("PrescriberAccessToken") || ""
      : "";
    const patientId = IS_BROWSER
      ? window.location.pathname.split("/")[3] || ""
      : "";
    getPrescriber(accessToken);
    getTreatmentsByPatient(accessToken, patientId, 1, true);
    getTreatmentsByPatient(accessToken, patientId, 1, false);
    getPatient(accessToken, patientId);
  }, []);

  const { displayNewTreatmentModal } = useUI();

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
        </div>
      </div>
      <PageWrap>
        {isLoading
          ? <span class="loading loading-spinner text-green-600"></span>
          : (
            <div class="flex flex-col gap-3 w-full">
              <div class="flex justify-between mb-8">
                <PrescriberUpdateTreatmentModal
                  onFinished={() => {
                    displayNewTreatmentModal.value = false;
                    let accessToken = "";
                    const patientId = IS_BROWSER
                      ? window.location.pathname.split("/")[3] || ""
                      : "";

                    if (IS_BROWSER) {
                      accessToken =
                        localStorage.getItem("PrescriberAccessToken") || "";
                    }
                    getTreatmentsByPatient(accessToken, patientId);
                  }}
                />
                <h3 class="text-2xl text-[#8b8b8b] text-center">Tratamento</h3>
                <button
                  class="btn btn-sm btn-secondary text-white"
                  onClick={() => {
                    displayNewTreatmentModal.value = true;
                  }}
                >
                  <Icon id="Drop" size={12} />
                  <span class="flex gap-[6px]">
                    {currentTreatment
                      ? (
                        <>
                          Atualizar{" "}
                          <span class="hidden sm:block">Tratamento</span>
                        </>
                      )
                      : (
                        <>
                          Criar <span class="hidden sm:block">Tratamento</span>
                        </>
                      )}
                  </span>
                </button>
              </div>
              <div class="flex flex-col gap-8">
                <div
                  class={`p-3 bg-[#ffffff] rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
                >
                  <div class="flex justify-between">
                    <div class="flex gap-4 items-center">
                      <div class="text-[#808080]">
                        <Icon id="Profile" size={16} />
                      </div>
                      <div class="flex flex-col items-start">
                        <span class="font-semibold">{patient?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="flex flex-col gap-4">
                    {!currentTreatment
                      ? (
                        <div class="flex justify-center items-center gap-2 text-[#808080]">
                          <span>Você não tem tratamentos cadastrados</span>
                          <button
                            class="btn btn-sm btn-secondary text-white"
                            onClick={() => {
                              displayNewTreatmentModal.value = true;
                            }}
                          >
                            <Icon id="Drop" size={12} />
                            <span class="flex gap-[6px]">
                              {treatments.length
                                ? (
                                  <>
                                    Atualizar{" "}
                                    <span class="hidden sm:block">
                                      Tratamento
                                    </span>
                                  </>
                                )
                                : (
                                  <>
                                    Criar{" "}
                                    <span class="hidden sm:block">
                                      Tratamento
                                    </span>
                                  </>
                                )}
                            </span>
                          </button>
                        </div>
                      )
                      : (
                        <>
                          <div>
                            <h3 class="text-sm text-[#8b8b8b] mb-2">
                              Tratamento Vigente
                            </h3>
                            <div>
                              <TreatmentCard treatment={currentTreatment!} />
                            </div>
                          </div>
                          {treatments.length
                            ? (
                              <div>
                                <h3 class="text-sm text-[#8b8b8b] mb-2">
                                  Tratamentos Antigos
                                </h3>
                                <div class="flex flex-col gap-4">
                                  {treatments?.map((t) => {
                                    return <TreatmentCard treatment={t!} />;
                                  })}
                                </div>
                              </div>
                            )
                            : null}
                        </>
                      )}
                  </div>
                </div>
              </div>
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
                        const patientId = IS_BROWSER
                          ? window.location.pathname.split("/")[3] || ""
                          : "";
                        getTreatmentsByPatient(
                          accessToken,
                          patientId,
                          page! - 1,
                          false,
                        );
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
                        const patientId = IS_BROWSER
                          ? window.location.pathname.split("/")[3] || ""
                          : "";

                        if (IS_BROWSER) {
                          accessToken =
                            localStorage.getItem("PrescriberAccessToken") || "";
                        }
                        getTreatmentsByPatient(
                          accessToken,
                          patientId,
                          page! + 1,
                          false,
                        );
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

export default PrescriberPatientTreatments;
