import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import PageWrap from "./PageWrap.tsx";
import Icon, { AvailableIcons } from "./Icon.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { Treatment } from "./PrescriberPatientsLive.tsx";
import MedicationEffectsCard from "./MedicationEffectsCardCompact.tsx";
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
    feedback_message: string;
  }[];
};

export type FeelingCountReport = FeelingCount[];

type FeelingCount = {
  _id: string;
  count: number;
  name: string;
  isGood: boolean;
  icon: string;
};

export type AverageRationReport = {
  _id: string;
  resultGrade: number;
  created_at: string;
}[];

export type Report = {
  goodFeelingsReports: FeelingReport[];
  badFeelingsReports: FeelingReport[];
  feelingCountReport: FeelingCountReport;
  averageRatio: AverageRationReport;
};

function PrescriberPatientTreatmentReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [_treatmentResponse, _setTreatmentResponse] = useState<
    TreatmentResponse | null
  >(null);
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [goodFeelingSelected, setGoodFeelingSelected] = useState<
    FeelingCount | null
  >(null);
  const [badFeelingSelected, setBadFeelingSelected] = useState<
    FeelingCount | null
  >(null);
  const getTreatment = async (accessToken: string) => {
    setIsLoading(true);
    const reportId = window.location.pathname.split("/").pop();
    const response = await invoke["deco-sites/ecannadeco"].actions.getTreatment(
      {
        token: accessToken,
        id: reportId,
      },
    );
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
      accessToken = localStorage.getItem("AccessToken") || "";
    }

    if (accessToken === "") {
      window.location.href = "/";
    }

    try {
      getTreatment(accessToken);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      if (IS_BROWSER) {
        localStorage.setItem("AccessToken", "");
      }
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    const goodFeeling = report?.feelingCountReport.find((r) => r.isGood);
    const badFeeling = report?.feelingCountReport.find((r) => !r.isGood);
    if (!goodFeelingSelected && goodFeeling) {
      setGoodFeelingSelected(goodFeeling);
    }
    if (!badFeelingSelected && badFeeling) {
      setBadFeelingSelected(badFeeling);
    }
  }, [report]);

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
              <div>
                {treatment && (
                  <TreatmentCard treatment={treatment!} isPatient={true} />
                )}
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

              <div class="w-full px-4">
                <h3 class="text-md">Condição geral do paciente</h3>
                <p class="text-xs mb-4">
                  Soma das notas do efeitos positivos subtraído pela soma das
                  notas dos efeitos negativos relatados
                </p>
                <Chart
                  type="line"
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        enabled: true,
                      },
                    },
                  }}
                  data={{
                    datasets: [
                      {
                        data: report?.averageRatio
                          .filter((r) => r.resultGrade)
                          .map((r) => r.resultGrade) || [],
                        backgroundColor: function (context) {
                          const value = context.dataset.data[context.dataIndex];
                          if (Number(value) > 0) {
                            return "green";
                          } else {
                            return "red";
                          }
                        },
                      },
                    ],

                    // These labels appear in the legend and in the tooltips when hovering different arcs
                    labels: report?.averageRatio
                      .filter((r) => r.resultGrade)
                      .map((r) => format(new Date(r.created_at), "dd/MM/yy")) ||
                      [],
                  }}
                />
              </div>

              {report &&
                report?.goodFeelingsReports.length === 0 &&
                report?.badFeelingsReports.length === 0 && (
                <a
                  class="flex flex-col gap-6"
                  href={`/novo-registro/${treatment?._id}`}
                >
                  Deixe seu primeiro feedback
                </a>
              )}
              {report && report?.goodFeelingsReports.length > 0 && (
                <div class="flex flex-col">
                  <h3 class="text-sm text-[#8b8b8b] mb-2">
                    Efeitos Desejados Relatados
                  </h3>
                  <div
                    class={`flex flex-col lg:flex-row gap-6 p-3 bg-[#ffffff] rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
                  >
                    <div class="flex flex-row lg:flex-col gap-6 pb-3">
                      {report?.feelingCountReport
                        .filter((r) => r.isGood)
                        .map((goodReport) => (
                          <div
                            class="cursor-pointer"
                            onClick={() => {
                              const feeling = report?.feelingCountReport.find(
                                (f) => f.name === goodReport.name,
                              ) ?? null;
                              setGoodFeelingSelected(feeling);
                            }}
                          >
                            <MedicationEffectsCard
                              icon={goodReport.icon as AvailableIcons}
                              name={goodReport.name}
                              isActive={goodFeelingSelected?.name ===
                                goodReport.name}
                              isGood={true}
                            />
                          </div>
                        ))}
                    </div>
                    <div class="flex flex-col flex-grow">
                      <div class="max-h-[500px] my-0 mx-auto">
                        <Chart
                          type="pie"
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: "right",
                                onClick: function (_e, legendItem) {
                                  const feeling =
                                    report?.feelingCountReport.find(
                                      (f) => f.name === legendItem.text,
                                    ) ?? null;
                                  setGoodFeelingSelected(feeling);
                                },
                              },
                            },
                          }}
                          data={{
                            datasets: [
                              {
                                data: report?.feelingCountReport
                                  .filter((r) => r.isGood === true)
                                  .map((r) => r.count) || [],
                              },
                            ],
                            // These labels appear in the legend and in the tooltips when hovering different arcs
                            labels: report?.feelingCountReport
                              .filter((r) => r.isGood === true)
                              .map((r) => r.name) || [],
                          }}
                        />
                      </div>
                      {report?.goodFeelingsReports
                        .filter((f) =>
                          f.feeling._id === goodFeelingSelected?._id
                        )
                        .map((report) => (
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
                                    data: report.entries.map(
                                      (entry) => entry.grade,
                                    ),
                                    spanGaps: 1,
                                    borderColor: "green",
                                    borderWidth: 1,
                                    backgroundColor: "green",
                                  },
                                ],
                              }}
                            />
                            <div class="w-full p-4">
                              {report.entries.filter((e) => e.feedback_message)
                                    .length > 0 && (
                                <h5 class="text-sm font-bold">
                                  Relatório de feedbacks
                                </h5>
                              )}
                              {report.entries
                                .filter((e) => e.feedback_message)
                                .map((entry) => (
                                  <p class="text-xs leading-6 border-b border-gray-300">
                                    {format(new Date(entry.date), "dd/MM/yy") +
                                        " - " +
                                        entry.feedback_message ||
                                      "Não informado"}
                                  </p>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
              {report && report?.badFeelingsReports.length > 0 && (
                <div class="flex flex-col">
                  <h3 class="text-sm text-[#8b8b8b] mb-2">
                    Efeitos Indesejados Relatados
                  </h3>
                  <div
                    class={`flex flex-col lg:flex-row gap-6 p-3 bg-[#ffffff] rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
                  >
                    <div class="flex flex-row lg:flex-col gap-6 pb-3">
                      {report?.feelingCountReport
                        .filter((r) => !r.isGood)
                        .map((badReport) => (
                          <div
                            class="cursor-pointer"
                            onClick={() => {
                              const feeling = report?.feelingCountReport.find(
                                (f) => f.name === badReport.name,
                              ) ?? null;
                              setBadFeelingSelected(feeling);
                            }}
                          >
                            <MedicationEffectsCard
                              icon={badReport.icon as AvailableIcons}
                              name={badReport.name}
                              isActive={badFeelingSelected?.name ===
                                badReport.name}
                              isGood={false}
                            />
                          </div>
                        ))}
                    </div>

                    <div class="flex flex-col flex-grow">
                      <div class="max-h-[500px] my-0 mx-auto">
                        <Chart
                          type="pie"
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: "right",
                                onClick: function (_e, legendItem) {
                                  const feeling =
                                    report?.feelingCountReport.find(
                                      (f) => f.name === legendItem.text,
                                    ) ?? null;
                                  setBadFeelingSelected(feeling);
                                },
                              },
                            },
                          }}
                          data={{
                            datasets: [
                              {
                                data: report?.feelingCountReport
                                  .filter((r) => r.isGood === false)
                                  .map((r) => r.count) || [],
                              },
                            ],
                            // These labels appear in the legend and in the tooltips when hovering different arcs
                            labels: report?.feelingCountReport
                              .filter((r) => r.isGood === false)
                              .map((r) => r.name) || [],
                          }}
                        />
                      </div>
                      {report?.badFeelingsReports
                        .filter((f) =>
                          f.feeling._id === badFeelingSelected?._id
                        )
                        .map((report) => (
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
                                    data: report.entries.map(
                                      (entry) => entry.grade,
                                    ),
                                    spanGaps: 1,
                                    borderColor: "red",
                                    backgroundColor: "red",
                                    borderWidth: 1,
                                  },
                                ],
                              }}
                            />
                            <div class="w-full p-4">
                              {report.entries.filter((e) => e.feedback_message)
                                    .length > 0 && (
                                <h5 class="text-sm font-bold">
                                  Relatório de feedbacks
                                </h5>
                              )}
                              {report.entries
                                .filter((e) => e.feedback_message)
                                .map((entry) => (
                                  <p class="text-xs leading-6 border-b border-gray-300">
                                    {format(new Date(entry.date), "dd/MM/yy") +
                                        " - " +
                                        entry.feedback_message ||
                                      "Não informado"}
                                  </p>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
              <button class="btn btn-primary text-white w-full" disabled>
                <Icon id="Calendar" size={16} />
                <span>Agendar Consulta (Breve)</span>
              </button>
            </div>
          )}
      </PageWrap>
    </>
  );
}

export default PrescriberPatientTreatmentReport;
