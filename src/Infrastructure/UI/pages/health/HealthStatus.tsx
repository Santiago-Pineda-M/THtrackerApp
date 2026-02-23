import React, { useMemo } from "react";
import { dependenciesLocator } from "../../../DI/DependenciesLocator";
import { usePlocState } from "../../../Hooks/usePlocState";
import { Activity, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";

export const HealthStatus: React.FC = () => {
    const ploc = useMemo(() => dependenciesLocator.provideHealthPloc(), []);
    const state = usePlocState(ploc);

    return (
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center space-y-4 border border-gray-100">
            <div className="flex items-center space-x-2">
                <Activity className="text-blue-500 w-6 h-6" />
                <h2 className="text-xl font-bold text-gray-800">API Status</h2>
            </div>

            <div className="flex flex-col items-center justify-center p-4">
                {state.isLoading ? (
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                ) : state.isAlive ? (
                    <ShieldCheck className="w-12 h-12 text-green-500" />
                ) : (
                    <ShieldAlert className="w-12 h-12 text-red-500" />
                )}

                <p className={`mt-2 font-medium ${state.isAlive ? 'text-green-600' : 'text-red-600'}`}>
                    {state.isLoading ? "Checking..." : state.isAlive ? "API is Online" : "API is Offline"}
                </p>
            </div>

            {state.lastChecked && (
                <p className="text-xs text-gray-400">
                    Last checked: {state.lastChecked.toLocaleTimeString()}
                </p>
            )}

            <button
                onClick={() => ploc.checkHealth()}
                disabled={state.isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center space-x-2"
            >
                <span>Check Now</span>
            </button>
        </div>
    );
};
