/**
 * This component was made to control if user is logged in to access pages
 */
import { useState } from "preact/hooks";
import PageWrap from "./PageWrap.tsx";
import Icon from "./Icon.tsx";
import { useUI } from "../../sdk/useUI.ts";
import PrescriberNewPatientModal from "../../islands/PrescriberNewPatientModal.tsx";

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
  updated_at: string;
  feedback?: "positive" | "negative";
  medication: {
    name: string;
    dosage: string;
  }[];
  entries?: Entry[];
  current: boolean;
  prescriber?: {
    name: string;
    registryType: string;
    registryUF: string;
    registry: string;
  };
  patient?: {
    name: string;
    email?: string;
  };
};

export type Patient = {
  name: string;
  email: string;
  last_treatment?: {
    updated_at: string | Date;
    feedback: "positive" | "negative";
  } | undefined;
  treatments?: Treatment[];
};

function PrescriberPatients() {
  const [isLoading, _setIsLoading] = useState(false);
  const [isLoadingUsers, _setIsLoadingUsers] = useState(false);
  const [emailSearch, setEmailSearch] = useState("");
  const [hasNextPage, _setHasNextPage] = useState<boolean>(false);
  const [hasPrevPage, _setHasPrevPage] = useState<boolean>(false);
  const [patients, _setpatients] = useState<Patient[]>([
    {
      name: "Célio Marcos",
      email: "celiomarcos@email.com",
      last_treatment: {
        updated_at: "2024-05-14T14:29:09.024+00:00",
        feedback: "positive",
      },
    },
    {
      name: "Márcia Romano",
      email: "marcia@email.com",
      last_treatment: {
        updated_at: "2024-05-14T14:29:09.024+00:00",
        feedback: "negative",
      },
    },
    {
      name: "Tauane Rodrigues",
      email: "tauame@email.com",
      last_treatment: undefined,
    },
  ]);

  const {
    displayNewPatientModal,
  } = useUI();

  const timeAgo = (date: Date): string => {
    const seconds = Math.floor((Number(new Date()) - +date) / 1000); // Explicitly convert to number
    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1) return `${interval}a atrás`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}m atrás`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d atrás`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h atrás`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}min atrás`;
    return `${Math.floor(seconds)}seg atrás`;
  };

  return (
    <PageWrap>
      {isLoading
        ? <span class="loading loading-spinner text-green-600"></span>
        : (
          <div class="flex flex-col gap-3 w-full">
            <div class="flex justify-center">
              <h3 class="text-2xl text-[#8b8b8b] text-center mb-8">
                Meus Pacientes
              </h3>
            </div>
            <div class="flex flex-col sm:flex-row gap-4 justify-between mb-4">
              <PrescriberNewPatientModal />
              <input
                placeholder="Pesquise por email"
                class="input rounded-full text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3] sm:w-1/2 h-[35px] text-xs"
                name="emailSearch"
                value={emailSearch}
                onChange={(e) => {
                  setEmailSearch(e.currentTarget.value);
                  if (e.currentTarget.value.length >= 3) {
                    // handleGetUsers(page!, e.currentTarget.value);
                  }
                }}
              />
              <div class="flex sm:w-1/2 justify-end">
                <button
                  class="btn btn-sm btn-secondary text-white"
                  onClick={() => {
                    displayNewPatientModal.value = true;
                  }}
                >
                  <Icon id="UserData" size={19} />Novo Paciente
                </button>
              </div>
            </div>
            {isLoadingUsers
              ? <span class="loading loading-spinner text-green-600"></span>
              : (
                <ul class="flex flex-col gap-4">
                  {patients && patients.map((p) => {
                    return (
                      <a href="/prescritor/paciente/123" class="">
                        <div tabindex={0} role="button" class="">
                          <div target="_blank">
                            <li
                              class={`p-3 ${
                                p.last_treatment?.feedback === "positive"
                                  ? "bg-[#ffffff]"
                                  : "bg-[#fff8dc]"
                              } rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
                            >
                              <div class="flex justify-between">
                                <div class="flex gap-4 items-center">
                                  <div class="text-[#808080]">
                                    <Icon id="Profile" size={16} />
                                  </div>
                                  <div class="flex flex-col items-start">
                                    <span class="font-semibold">
                                      {p.name}
                                    </span>
                                    <span class="text-sm">
                                      {p.email}
                                    </span>
                                  </div>
                                </div>
                                {p.last_treatment
                                  ? (
                                    <div class="flex flex-col items-end gap-2">
                                      <div class="flex justify-between items-center gap-2 text-[#808080]">
                                        <Icon id="Update" size={16} />
                                        <span>
                                          {timeAgo(
                                            new Date(
                                              p.last_treatment.updated_at,
                                            ),
                                          )}
                                        </span>
                                      </div>
                                      <div
                                        class={`${
                                          p.last_treatment.feedback ===
                                              "positive"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                      >
                                        <Icon
                                          id={`${
                                            p.last_treatment.feedback ===
                                                "positive"
                                              ? "HappyFace"
                                              : "SadFace"
                                          }`}
                                          size={19}
                                        />
                                      </div>
                                    </div>
                                  )
                                  : (
                                    <div class="flex items-center justify-end">
                                      <div class="badge badge-primary badge-xs p-2">
                                        Sem Registro
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </li>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </ul>
              )}
            {/* pagination */}
            <div class="flex justify-center mt-4">
              <div>
                {hasPrevPage && (
                  <Icon
                    // onClick={() => handleGetUsers(page! - 1)}
                    id="ChevronLeft"
                    size={19}
                  />
                )}
              </div>
              <div>
                <span class="text-xs">
                  {`Página 1/1`}
                  {/* {`Página ${page}/${totalPages}`} */}
                </span>
              </div>
              <div>
                {hasNextPage && (
                  <Icon
                    // onClick={() => handleGetUsers(page! + 1)}
                    id="ChevronRight"
                    size={19}
                  />
                )}
              </div>
            </div>
          </div>
        )}
    </PageWrap>
  );
}

export default PrescriberPatients;
