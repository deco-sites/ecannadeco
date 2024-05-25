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
import Image from "apps/website/components/Image.tsx";
import Loading from "../daisy/Loading.tsx";
import type { DocListType } from "./MyDocs.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import PrescriberNewPatientModal from "../../islands/PrescriberNewPatientModalLive.tsx";
import { use } from "https://esm.sh/marked@9.1.1";

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
  status?: "NEUTRAL" | "GOOD" | "BAD";
  medications: {
    name: string;
    dosage: string;
  }[];
  isActive: boolean;
  prescriber?: {
    _id: string;
    name: string;
    registryType: string;
    registryUF: string;
    registry: string;
  };
  patient?: {
    _id: string;
    name: string;
  };
};

export type Patient = {
  _id: string;
  name: string;
  email: string;
  lastReport?: string | Date;
  status?: string;
};

function PrescriberPatients() {
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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [docs, setDocs] = useState<DocListType[]>([]);

  const getPatients = async (accessToken: string) => {
    setIsLoadingUsers(true);
    const response = await invoke["deco-sites/ecannadeco"].actions
      .prescriberGetPatients({
        token: accessToken,
      });
    setIsLoadingUsers(false);
    if (response) {
      setPatients(response as Patient[]);
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
      getPatients(accessToken);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      if (IS_BROWSER) {
        localStorage.setItem("AccessToken", "");
      }
      window.location.href = "/";
    }
  }, []);

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
                      <a href={`/prescritor/meus-pacientes/${p._id}`} class="">
                        <div tabindex={0} role="button" class="">
                          <div target="_blank">
                            <li
                              class={`p-3 ${
                                p.status === "GOOD"
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
                                {p.lastReport
                                  ? (
                                    <div class="flex flex-col items-end gap-2">
                                      <div class="flex justify-between items-center gap-2 text-[#808080]">
                                        <Icon id="Update" size={16} />
                                        <span>
                                          {timeAgo(
                                            new Date(
                                              p.lastReport,
                                            ),
                                          )}
                                        </span>
                                      </div>
                                      <div
                                        class={`${
                                          p.status ===
                                              "GOOD"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                      >
                                        <Icon
                                          id={`${
                                            p.status ===
                                                "GOOD"
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
