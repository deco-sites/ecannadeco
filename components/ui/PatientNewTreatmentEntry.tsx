/**
 * This component was made to control if user is logged in to access pages
 */
import { useState } from "preact/hooks";
import PageWrap from "./PageWrap.tsx";
import Icon from "./Icon.tsx";
import type { Treatment } from "./PrescriberPatients.tsx";
import MedicationEffectsCard, { symbolName } from "./MedicationEffectsCard.tsx";
import type { AvailableEffects } from "./MedicationEffectsCard.tsx";
import TreatmentCard from "./TreatmentCard.tsx";
import { format } from "datetime";

export type Address = {
  cep: string;
  number: string;
  complement: string;
  addressType: string;
};

function PatientNewTreatmentEntry() {
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
      entries: [{
        created_at: "2024-05-14T14:29:09.024+00:00",
        desiredEffects: [{
          effect: {
            name: "hunger",
          },
          intensity: 4,
        }, {
          effect: {
            name: "sleep",
          },
          intensity: 3,
        }],
        undesiredEffects: [{
          effect: {
            name: "headache",
          },
          intensity: 4,
        }, {
          effect: {
            name: "dizziness",
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
    },
  );
  const [desiredEffects, setDesiredEffects] = useState<{
    effect: {
      name: string;
    };
    intensity: number;
  }[]>(
    [],
  );
  const [undesiredEffects, setUndesiredEffects] = useState<{
    effect: {
      name: string;
    };
    intensity: number;
  }[]>(
    [],
  );
  const [availableDesiredEffects, _setAvailableDesiredEffects] = useState<
    AvailableEffects[]
  >(["hunger", "sleep", "focus" /*"relaxation", "disposition", "painRelief"*/]);
  const [availableUndesiredEffects, _setAvailableUndesiredEffects] = useState<
    AvailableEffects[]
  >([
    "dizziness",
    "nausea",
    "headache", /*"anxiety", "confusion", "depression"*/
  ]);

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
          <a href="/tratamento/123" class="btn btn-sm btn-secondary text-white">
            <Icon id="Chart" size={19} />
            <span>
              Relatório Completo
            </span>
          </a>
        </div>
      </div>
      <PageWrap>
        {isLoading
          ? <span class="loading loading-spinner text-green-600"></span>
          : (
            <div class="flex flex-col gap-8 w-full">
              <div class="flex justify-between">
                <h3 class="text-2xl text-[#8b8b8b] text-center">
                  Novo Registro
                </h3>
              </div>
              <div class="flex justify-center">
                <div class="bg-white rounded-md shadow flex items-center justify-center gap-10 p-3 w-fit">
                  <div class="flex gap-2 items-center">
                    <Icon id="Calendar" size={18} />
                    <span>{format(new Date(), "dd/MM/yyyy")}</span>
                  </div>
                </div>
              </div>
              <div>
                <TreatmentCard treatment={treatment!} hideLastFeedback={true} />
              </div>
              <div class="flex flex-col">
                <h3 class="text-sm text-[#8b8b8b] mb-2">
                  Selecione Efeitos Desejados
                </h3>
                <div
                  class={`flex flex-col gap-6 p-3 bg-[#ffffff] rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
                >
                  <div class="flex gap-8">
                    {availableDesiredEffects.map((ef) => {
                      return (
                        <div
                          class="cursor-pointer"
                          onClick={() => {
                            if (
                              !desiredEffects.find((e) => e.effect.name === ef)
                            ) {
                              const newDesiredEffects = [...desiredEffects];
                              newDesiredEffects.push(
                                {
                                  effect: {
                                    name: ef,
                                  },
                                  intensity: 5,
                                },
                              );
                              setDesiredEffects(newDesiredEffects);
                            }
                          }}
                        >
                          <MedicationEffectsCard id={ef} />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div class="flex flex-col gap-4 mt-4">
                  {desiredEffects.map((ef, index) => {
                    return (
                      <div class="flex gap-4 items-center" key={index}>
                        <span>{symbolName[ef.effect.name].name}</span>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={ef.intensity}
                          onChange={(e) => {
                            console.log({ value: e.currentTarget.value });
                            const newIntensity = Number(e.currentTarget.value);

                            // Create a new array with the updated effect
                            const newEffectArray = desiredEffects.map(
                              (effect, idx) => {
                                if (idx === index) {
                                  return {
                                    ...effect,
                                    intensity: newIntensity,
                                  };
                                }
                                return effect;
                              },
                            );

                            setDesiredEffects(newEffectArray);
                          }}
                          class="range range-sm [--range-shdw:#32b541]"
                        />
                        <div class="bordered border-[#acacac] bg-white p-2 rounded-md">
                          {ef.intensity}
                        </div>
                        <div
                          class="cursor-pointer text-[#808080]"
                          onClick={() => {
                            const newDesiredEffects = desiredEffects.filter((
                              _,
                              idx,
                            ) => idx !== index);
                            setDesiredEffects(newDesiredEffects);
                          }}
                        >
                          <Icon id="Close" size={16} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div class="flex flex-col">
                <h3 class="text-sm text-[#8b8b8b] mb-2">
                  Selecione Efeitos Indesejados
                </h3>
                <div
                  class={`flex flex-col gap-6 p-3 bg-[#ffffff] rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
                >
                  <div class="flex gap-8">
                    {availableUndesiredEffects.map((ef) => {
                      return (
                        <div
                          class="cursor-pointer"
                          onClick={() => {
                            if (
                              !undesiredEffects.find((e) =>
                                e.effect.name === ef
                              )
                            ) {
                              const newUndesiredEffects = [...undesiredEffects];
                              newUndesiredEffects.push(
                                {
                                  effect: {
                                    name: ef,
                                  },
                                  intensity: 5,
                                },
                              );
                              setUndesiredEffects(newUndesiredEffects);
                            }
                          }}
                        >
                          <MedicationEffectsCard id={ef} />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div class="flex flex-col gap-4 mt-4">
                  {undesiredEffects.map((ef, index) => {
                    return (
                      <div class="flex gap-4 items-center" key={index}>
                        <span>{symbolName[ef.effect.name].name}</span>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={ef.intensity}
                          onChange={(e) => {
                            console.log({ value: e.currentTarget.value });
                            const newIntensity = Number(e.currentTarget.value);

                            // Create a new array with the updated effect
                            const newEffectArray = undesiredEffects.map(
                              (effect, idx) => {
                                if (idx === index) {
                                  return {
                                    ...effect,
                                    intensity: newIntensity,
                                  };
                                }
                                return effect;
                              },
                            );

                            setUndesiredEffects(newEffectArray);
                          }}
                          class="range range-sm [--range-shdw:#d93939]"
                        />
                        <div class="bordered border-[#acacac] bg-white p-2 rounded-md">
                          {ef.intensity}
                        </div>
                        <div
                          class="cursor-pointer text-[#808080]"
                          onClick={() => {
                            const newUndesiredEffects = undesiredEffects.filter(
                              (
                                _,
                                idx,
                              ) => idx !== index,
                            );
                            setUndesiredEffects(newUndesiredEffects);
                          }}
                        >
                          <Icon id="Close" size={16} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <button class="btn btn-primary text-white w-full">
                  Salvar Registro
                </button>
              </div>
            </div>
          )}
      </PageWrap>
    </>
  );
}

export default PatientNewTreatmentEntry;
