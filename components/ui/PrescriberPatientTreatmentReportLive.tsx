/**
 * This component was made to control if user is logged in to access pages
 */
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import PageWrap from "./PageWrap.tsx";
import Icon, { AvailableIcons } from "./Icon.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { Treatment } from "./PrescriberPatientsLive.tsx";
import MedicationEffectsCard from "./MedicationEffectsCardLive.tsx";
import TreatmentCard from "./TreatmentCardLive.tsx";
import Chart from "deco-sites/ecannadeco/islands/FreshChart.tsx";
import { format } from "datetime";

export type Address = {
  cep: string;
  number: string;
  complement: string;
  addressType: string;
};

export type TreatmentResponse = {
  treatment: Treatment;
  report: Report;
};

export type FeelingReport = {
  feeling: {
    name: string;
    _id: string;
    icon: string;
  };
  entries: {
    grade: number;
    date: string;
  }[];
};

export type Report = {
  goodFeelingsReports: FeelingReport[];
  badFeelingsReports: FeelingReport[];
};

function PrescriberPatientTreatmentReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [report, setReport] = useState<Report | null>(null);

  const getTreatment = async (accessToken: string) => {
    setIsLoading(true);
    const treatmentId = window.location.pathname.split("/").pop();
    const response = await invoke["deco-sites/ecannadeco"].actions
      .prescriberGetTreatmentByPatient({
        token: accessToken,
        treatmentId,
      });
    setIsLoading(false);
    if (response) {
      setTreatment(response?.treatment as Treatment);
      setReport(response?.report as Report);
    }
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
      getTreatment(accessToken);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      if (IS_BROWSER) {
        localStorage.setItem("PrescriberAccessToken", "");
      }
      window.location.href = "/";
    }
  }, []);

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
            <div class="flex flex-col gap-8 w-full">
              <div class="flex justify-center">
                <h3 class="text-2xl text-[#8b8b8b] text-center">
                  Relatório de Tratamento
                </h3>
              </div>
              {
                /* <div>
                <div class="bg-white rounded-md shadow flex items-center justify-center gap-4 p-3">
                  <div class="flex gap-2 items-center">
                    <Icon id="Calendar" size={18} />
                    <span>09/05/2024</span>
                  </div>
                  <span>a</span>
                  <div class="flex gap-2 items-center">
                    <Icon id="Calendar" size={18} />
                    <span>09/05/2024</span>
                  </div>
                </div>
              </div> */
              }
              <div>
                {treatment && (
                  <TreatmentCard treatment={treatment!} isPatient={false} />
                )}
              </div>

              {(report && report?.goodFeelingsReports.length > 0) && (
                <div class="flex flex-col">
                  <h3 class="text-sm text-[#8b8b8b] mb-2">
                    Efeitos Desejados Relatados
                  </h3>
                  <div
                    class={`flex flex-col gap-6 p-3 bg-[#ffffff] rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
                  >
                    <div class="flex gap-8">
                      {report?.goodFeelingsReports.map((report) => (
                        <MedicationEffectsCard
                          icon={report.feeling.icon as AvailableIcons}
                          name={report.feeling.name}
                        />
                      ))}
                    </div>
                    {
                      <div class="collapse collapse-arrow border border-base-300 bg-base-200">
                        <input type="checkbox" />
                        <div class="collapse-title text-xl font-medium">
                          <span class="underline text-sm">
                            Histórico dos efeitos
                          </span>
                        </div>
                        <div class="collapse-content flex flex-col gap-[48px]">
                          {report?.goodFeelingsReports.map((report) => (
                            <div>
                              <Chart
                                type="line"
                                options={{
                                  scales: { y: { min: 1, max: 10 } },
                                }}
                                data={{
                                  labels: report.entries.map((entry) =>
                                    format(new Date(entry.date), "dd/MM/yy")
                                  ),
                                  datasets: [
                                    {
                                      label: `${report.feeling.name}`,
                                      data: report.entries.map((entry) =>
                                        entry.grade
                                      ),
                                      spanGaps: 1,
                                      borderColor: "#32b541",
                                      borderWidth: 1,
                                    },
                                  ],
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    }
                  </div>
                </div>
              )}
              {(report && report?.badFeelingsReports.length > 0) && (
                <div class="flex flex-col">
                  <h3 class="text-sm text-[#8b8b8b] mb-2">
                    Efeitos Indesejados Relatados
                  </h3>
                  <div
                    class={`flex flex-col gap-6 p-3 bg-[#ffffff] rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
                  >
                    <div class="flex gap-8">
                      {report?.badFeelingsReports.map((report) => (
                        <MedicationEffectsCard
                          icon={report.feeling.icon as AvailableIcons}
                          name={report.feeling.name}
                        />
                      ))}
                    </div>

                    <div class="collapse collapse-arrow border border-base-300 bg-base-200">
                      <input type="checkbox" />
                      <div class="collapse-title text-xl font-medium">
                        <span class="underline text-sm">
                          Histórico dos efeitos
                        </span>
                      </div>
                      <div class="collapse-content flex flex-col gap-[48px]">
                        {report?.badFeelingsReports.map((report) => (
                          <div>
                            <Chart
                              type="line"
                              options={{
                                scales: { y: { min: 1, max: 10 } },
                              }}
                              data={{
                                labels: report.entries.map((entry) =>
                                  format(new Date(entry.date), "dd/MM/yy")
                                ),
                                datasets: [
                                  {
                                    label: `${report.feeling.name}`,
                                    data: report.entries.map((entry) =>
                                      entry.grade
                                    ),
                                    spanGaps: 1,
                                    borderColor: "#d93939",
                                    borderWidth: 1,
                                  },
                                ],
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
      </PageWrap>
    </>
  );
}

export default PrescriberPatientTreatmentReport;
