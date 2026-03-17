import React, { useMemo } from "react";
import { dependenciesLocator } from "../../../DI/DependenciesLocator";
import { usePlocState } from "../../../Hooks/usePlocState";

export const HealthStatus: React.FC = () => {
    const ploc = useMemo(() => dependenciesLocator.provideHealthPloc(), []);
    const state = usePlocState(ploc);

    const status = state.isLoading ? "Checking..." : state.isAlive ? "Online" : "Offline";

    return (
        <>
            <h1>API Status</h1>
            <p>{status}</p>
            <button onClick={() => ploc.checkHealth()} disabled={state.isLoading}>Check</button>
        </>
    );
};
