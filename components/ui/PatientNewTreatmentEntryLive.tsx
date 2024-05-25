/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import PageWrap from "./PageWrap.tsx";
import Icon, { AvailableIcons } from "./Icon.tsx";
import { useUI } from "../../sdk/useUI.ts";
import type { DocListType } from "./MyDocs.tsx";
import Modal from "./Modal.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { Patient, Treatment } from "./PrescriberPatientsLive.tsx";
import MedicationEffectsCard, {
  symbolName,
} from "./MedicationEffectsCardLive.tsx";
import type { AvailableEffects } from "./MedicationEffectsCardLive.tsx";
import TreatmentCard from "./TreatmentCardLive.tsx";
import Chart from "deco-sites/ecannadeco/islands/FreshChart.tsx";
import { format } from "datetime";

export type Address = {
  cep: string;
  number: string;
  complement: string;
  addressType: string;
};

export type Feeling = {
  _id: string;
  name: string;
  isGood: boolean;
  icon: string;
};

function PatientNewTreatmentEntry() {
  const [isLoading, setIsLoading] = useState(false);
  const [feelings, setFeelings] = useState<Feeling[]>([]);
  const [treatment, setTreatment] = useState<Treatment | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    const treatmentId = window.location.pathname.split("/").pop();
    const accessToken = localStorage.getItem("AccessToken") || "";
    const response = await invoke["deco-sites/ecannadeco"].actions
      .createTreatmentReport({
        token: accessToken,
        id: treatmentId,
        goodFeelings: desiredEffects.map((ef) => ({
          _id: ef.effect._id,
          grade: ef.intensity,
        })),
        badFeelings: undesiredEffects.map((ef) => ({
          _id: ef.effect._id,
          grade: ef.intensity,
        })),
      });
    setIsLoading(false);
    if (response) {
      window.location.href = `/tratamentos/${treatmentId}`;
    }
  };

  const getFeelings = async () => {
    setIsLoading(true);
    const response = await invoke["deco-sites/ecannadeco"].actions
      .getFeelings();
    setIsLoading(false);
    if (response) {
      setFeelings(response as Feeling[]);

      setAvailableDesiredEffects(
        (response as Feeling[]).filter((f) => f.isGood),
      );
      setAvailableUndesiredEffects(
        (response as Feeling[]).filter((f) => !f.isGood),
      );
    }
  };

  const getTreatment = async (accessToken: string) => {
    setIsLoading(true);
    const reportId = window.location.pathname.split("/").pop();
    const response = await invoke["deco-sites/ecannadeco"].actions
      .getTreatment({
        token: accessToken,
        id: reportId,
      });
    setIsLoading(false);
    if (response) {
      setTreatment(response?.treatment as Treatment);
    }
  };

  useEffect(() => {
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
    }

    if (accessToken === "") {
      window.location.href = "/";
    }
    getFeelings();
    getTreatment(accessToken);
  }, []);
  const [desiredEffects, setDesiredEffects] = useState<{
    effect: {
      name: string;
      _id: string;
      icon: string;
    };
    intensity: number;
  }[]>(
    [],
  );
  const [undesiredEffects, setUndesiredEffects] = useState<{
    effect: {
      name: string;
      _id: string;
      icon: string;
    };
    intensity: number;
  }[]>(
    [],
  );
  const [availableDesiredEffects, setAvailableDesiredEffects] = useState<
    Feeling[]
  >([]);
  const [availableUndesiredEffects, setAvailableUndesiredEffects] = useState<
    Feeling[]
  >([]);

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
          <a
            href={`/tratamentos/${treatment?._id}`}
            class="btn btn-sm btn-secondary text-white"
          >
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
                {treatment && (
                  <TreatmentCard
                    treatment={treatment!}
                    isPatient={true}
                    hideLastFeedback={true}
                  />
                )}
              </div>
              <div class="flex flex-col">
                <h3 class="text-sm text-[#8b8b8b] mb-2">
                  Selecione Efeitos Desejados
                </h3>
                <div
                  class={`flex flex-col gap-6 p-3 bg-[#ffffff] rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
                >
                  <div class="flex gap-8 overflow-scroll">
                    {availableDesiredEffects.map((ef) => {
                      return (
                        <div
                          class="cursor-pointer"
                          onClick={() => {
                            if (
                              !desiredEffects.find((e) =>
                                e.effect.name === ef.name
                              )
                            ) {
                              const newDesiredEffects = [...desiredEffects];
                              newDesiredEffects.push(
                                {
                                  effect: {
                                    name: ef.name,
                                    _id: ef._id,
                                    icon: ef.icon,
                                  },
                                  intensity: 5,
                                },
                              );
                              setDesiredEffects(newDesiredEffects);
                            }
                          }}
                        >
                          <MedicationEffectsCard
                            icon={ef.icon as AvailableIcons}
                            name={ef.name}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div class="flex flex-col gap-4 mt-4">
                  {desiredEffects.map((ef, index) => {
                    return (
                      <div class="flex gap-4 items-center" key={index}>
                        <span>
                          <Icon
                            id={ef.effect.icon as AvailableIcons}
                            size={32}
                          />
                        </span>
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
                  <div class="flex gap-8  overflow-scroll">
                    {availableUndesiredEffects.map((ef) => {
                      return (
                        <div
                          class="cursor-pointer"
                          onClick={() => {
                            if (
                              !undesiredEffects.find((e) =>
                                e.effect.name === ef.name
                              )
                            ) {
                              const newUndesiredEffects = [...undesiredEffects];
                              newUndesiredEffects.push(
                                {
                                  effect: {
                                    name: ef.name,
                                    _id: ef._id,
                                    icon: ef.icon,
                                  },
                                  intensity: 5,
                                },
                              );
                              setUndesiredEffects(newUndesiredEffects);
                            }
                          }}
                        >
                          <MedicationEffectsCard
                            icon={ef.icon as AvailableIcons}
                            name={ef.name}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div class="flex flex-col gap-4 mt-4">
                  {undesiredEffects.map((ef, index) => {
                    return (
                      <div class="flex gap-4 items-center" key={index}>
                        <span>
                          <Icon
                            id={ef.effect.icon as AvailableIcons}
                            size={32}
                          />
                        </span>
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
                <button
                  class="btn btn-primary text-white w-full"
                  onClick={handleSubmit}
                >
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
