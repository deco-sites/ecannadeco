/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import PageWrap from "./PageWrap.tsx";
import Icon from "./Icon.tsx";
import { useUI } from "../../sdk/useUI.ts";
import type { DocListType } from "./MyDocs.tsx";
import Modal from "./Modal.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { Patient, Treatment } from "./PrescriberPatients.tsx";
import MedicationEffectsCard, { symbolName } from "./MedicationEffectsCard.tsx";
import type { AvailableEffects } from "./MedicationEffectsCard.tsx";
import TreatmentCard from "./TreatmentCard.tsx";
import Chart from "deco-sites/ecannadeco/islands/FreshChart.tsx";
import { format } from "datetime";

export type Address = {
  cep: string;
  number: string;
  complement: string;
  addressType: string;
};

function PatientNewTreatmentEntry() {
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [emailSearch, setEmailSearch] = useState("");
  const [associationName, setAssociationName] = useState("");
  const [associationCnpj, setAssociationCnpj] = useState("");
  const [associationLogo, setAssociationLogo] = useState("");
  const [createType, setCreateType] = useState<"user" | "association">(
    "association",
  );
  const [limit, setLimit] = useState<number>();
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
  const [page, setPage] = useState<number>();
  const [totalPages, setTotalPages] = useState<number>();
  const [range, setRange] = useState<number>(4);
  const [treatment, setTreatment] = useState<Treatment>(
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
  const [availableDesiredEffects, setAvailableDesiredEffects] = useState<
    AvailableEffects[]
  >(["hunger", "sleep", "focus"]);
  const [availableUndesiredEffects, setAvailableUndesiredEffects] = useState<
    AvailableEffects[]
  >(["dizziness", "nausea", "headache"]);

  return (
    <PageWrap>
      {isLoading
        ? <span class="loading loading-spinner text-green-600"></span>
        : (
          <div class="flex flex-col gap-8 w-full">
            <div class="flex justify-center">
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
                            !undesiredEffects.find((e) => e.effect.name === ef)
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
                          const newUndesiredEffects = undesiredEffects.filter((
                            _,
                            idx,
                          ) => idx !== index);
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
  );
}

export default PatientNewTreatmentEntry;
