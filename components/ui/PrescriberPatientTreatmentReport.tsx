/**
 * This component was made to control if user is logged in to access pages
 */
import { useState } from "preact/hooks";
import PageWrap from "./PageWrap.tsx";
import Icon from "./Icon.tsx";
import type { Treatment } from "./PrescriberPatients.tsx";
import MedicationEffectsCard from "./MedicationEffectsCard.tsx";
import TreatmentCard from "./TreatmentCard.tsx";
import Chart from "deco-sites/ecannadeco/islands/FreshChart.tsx";
import { format } from "datetime";

export type Address = {
  cep: string;
  number: string;
  complement: string;
  addressType: string;
};

function PrescriberPatientTreatmentReport() {
  const [isLoading, _setIsLoading] = useState(false);
  const [treatment, _setTreatment] = useState<Treatment>(
    {
      updated_at: "2024-05-14T14:29:09.024+00:00",
      medication: [{
        name: "CBD 3000mg - Abrapango",
        dosage: "3 gotas 2x/ dia",
      }, {
        name: "THC 50mg - Abrapango",
        dosage: "3 gotas 2x/ dia",
      }],
      feedback: "positive",
      entries: [{
        created_at: "2024-05-14T14:29:09.024+00:00",
        desiredEffects: [{
          effect: {
            name: "Fome",
          },
          intensity: 4,
        }, {
          effect: {
            name: "Sono",
          },
          intensity: 3,
        }],
        undesiredEffects: [{
          effect: {
            name: "Dor de Cabeça",
          },
          intensity: 4,
        }, {
          effect: {
            name: "Tontura",
          },
          intensity: 3,
        }],
      }],
      current: true,
      prescriber: {
        name: "Dra. Endy Lacet",
        registryType: "CRO",
        registryUF: "DF",
        registry: "0000000",
      },
      patient: {
        name: "Célio Marcos",
        email: "celio@gmail.com",
      },
    },
  );

  return (
    <>
      <div class="w-full flex justify-center mb-4">
        <div class="flex justify-start w-[90%] max-w-[800px]">
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
              </div>
              <div
                class={`p-3 bg-[#ffffff] rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
              >
                <div class="flex justify-between">
                  <div class="flex gap-4 items-center">
                    <div class="text-[#808080]">
                      <Icon id="Profile" size={16} />
                    </div>
                    <div class="flex flex-col items-start">
                      <span class="font-semibold">
                        {treatment.patient!.name}
                      </span>
                      <span class="text-sm">
                        {treatment.patient!.email!}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <TreatmentCard treatment={treatment!} />
              </div>
              <div class="flex flex-col">
                <h3 class="text-sm text-[#8b8b8b] mb-2">
                  Efeitos Desejados Relatados
                </h3>
                <div
                  class={`flex flex-col gap-6 p-3 bg-[#ffffff] rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
                >
                  <div class="flex gap-8">
                    <MedicationEffectsCard id="hunger" />
                    <MedicationEffectsCard id="sleep" />
                    <MedicationEffectsCard id="focus" />
                  </div>
                  <div class="collapse collapse-arrow border border-base-300 bg-base-200">
                    <input type="checkbox" />
                    <div class="collapse-title text-xl font-medium">
                      <span class="underline text-sm">
                        Histórico dos efeitos
                      </span>
                    </div>
                    <div class="collapse-content flex flex-col gap-[48px]">
                      <div>
                        <Chart
                          type="line"
                          options={{
                            scales: { y: { beginAtZero: true } },
                          }}
                          data={{
                            labels: [
                              "01/04",
                              "02/04",
                              "12/05",
                              `${format(new Date(), "dd/MM")}`,
                            ],
                            datasets: [
                              {
                                label: "Fome - 09/05/2024 a 09/05/2024",
                                data: [4, 6, 8, 7],
                                borderColor: "#32b541",
                                borderWidth: 1,
                              },
                            ],
                          }}
                        />
                      </div>
                      <div>
                        <Chart
                          type="line"
                          options={{
                            scales: { y: { beginAtZero: true } },
                          }}
                          data={{
                            labels: [
                              "01/04",
                              "02/04",
                              "12/05",
                              `${format(new Date(), "dd/MM")}`,
                            ],
                            datasets: [
                              {
                                label: "Sono - 09/05/2024 a 09/05/2024",
                                data: [5, 6, 4, 8],
                                borderColor: "#32b541",
                                borderWidth: 1,
                              },
                            ],
                          }}
                        />
                      </div>
                      <div>
                        <Chart
                          type="line"
                          options={{
                            scales: { y: { beginAtZero: true } },
                          }}
                          data={{
                            labels: [
                              "01/04",
                              "02/04",
                              "12/05",
                              `${format(new Date(), "dd/MM")}`,
                            ],
                            datasets: [
                              {
                                label: "Foco - 09/05/2024 a 09/05/2024",
                                data: [4, 4, 2, 6],
                                borderColor: "#32b541",
                                borderWidth: 1,
                              },
                            ],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col">
                <h3 class="text-sm text-[#8b8b8b] mb-2">
                  Efeitos Indesejados Relatados
                </h3>
                <div
                  class={`flex flex-col gap-6 p-3 bg-[#ffffff] rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
                >
                  <div class="flex gap-8">
                    <MedicationEffectsCard id="headache" />
                    <MedicationEffectsCard id="nausea" />
                  </div>
                  <div class="collapse collapse-arrow border border-base-300 bg-base-200">
                    <input type="checkbox" />
                    <div class="collapse-title text-xl font-medium">
                      <span class="underline text-sm">
                        Histórico dos efeitos
                      </span>
                    </div>
                    <div class="collapse-content flex flex-col gap-[48px]">
                      <div>
                        <Chart
                          type="line"
                          options={{
                            scales: { y: { beginAtZero: true } },
                          }}
                          data={{
                            labels: [
                              "01/04",
                              "02/04",
                              "12/05",
                              `${format(new Date(), "dd/MM")}`,
                            ],
                            datasets: [
                              {
                                label:
                                  "Dor de Cabeça - 09/05/2024 a 09/05/2024",
                                data: [2, 6, 5, 4],
                                borderColor: "#d93939",
                                borderWidth: 1,
                              },
                            ],
                          }}
                        />
                      </div>
                      <div>
                        <Chart
                          type="line"
                          options={{
                            scales: { y: { beginAtZero: true } },
                          }}
                          data={{
                            labels: [
                              "01/04",
                              "02/04",
                              "12/05",
                              `${format(new Date(), "dd/MM")}`,
                            ],
                            datasets: [
                              {
                                label: "Enjôo - 09/05/2024 a 09/05/2024",
                                data: [4, 2, 1, 3],
                                borderColor: "#d93939",
                                borderWidth: 1,
                              },
                            ],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {
                /* <button class="btn btn-secondary text-white w-full">
                <Icon id="Drop" size={16} />
                <span>Atualizar Tratamento</span>
              </button> */
              }
            </div>
          )}
      </PageWrap>
    </>
  );
}

export default PrescriberPatientTreatmentReport;
