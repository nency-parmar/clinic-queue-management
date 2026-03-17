import { useEffect, useState } from "react";
import { getQueue } from "../../api/endpoints";

const TvDisplay = () => {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchQueue = async () => {
        try {
            const res = await getQueue();
            const validData = Array.isArray(res.data) ? res.data : [];
            setQueue(validData);
        } catch (err) {
            console.error("Failed to fetch TV queue", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && queue.length === 0) {
        return <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "white", fontSize: "2rem" }}>Loading display...</div>;
    }

    const inProgress = queue.filter(q => q.status?.toLowerCase() === "in-progress");
    const waiting = queue.filter(q => q.status?.toLowerCase() === "waiting");

    return (
        <div style={{ height: "100vh", width: "100vw", backgroundColor: "#f8fafc", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            <div style={{ backgroundColor: "var(--primary-blue)", color: "white", padding: "30px", textAlign: "center", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", zIndex: 10 }}>
                <h1 style={{ fontSize: "3rem", margin: 0, fontWeight: "700", letterSpacing: "2px" }}>PATIENT QUEUE</h1>
            </div>

            <div style={{ display: "flex", flex: 1, backgroundColor: "#f1f5f9" }}>

                <div style={{ flex: "1.2", padding: "40px", display: "flex", flexDirection: "column", borderRight: "2px solid #e2e8f0", backgroundColor: "white" }}>
                    <h2 style={{ fontSize: "2rem", color: "var(--success)", borderBottom: "4px solid var(--success)", paddingBottom: "16px", marginBottom: "40px" }}>
                        CURRENTLY SERVING
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "30px", flex: 1 }}>
                        {inProgress.length === 0 ? (
                            <div style={{ margin: "auto", textAlign: "center", color: "var(--text-muted)", fontSize: "2rem" }}>
                                Doctor is currently available
                            </div>
                        ) : (
                            inProgress.slice(0, 3).map(p => (
                                <div key={p.id} style={{
                                    background: "#f0fdf4",
                                    border: "2px solid #bbf7d0",
                                    borderRadius: "16px",
                                    padding: "30px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
                                }}>
                                    <div>
                                        <div style={{ fontSize: "1.5rem", color: "var(--text-muted)", marginBottom: "8px" }}>Patient</div>
                                        <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#166534" }}>{p.patientName}</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: "1.5rem", color: "var(--text-muted)", marginBottom: "8px" }}>Token</div>
                                        <div style={{ fontSize: "3.5rem", fontWeight: "800", color: "var(--success)" }}>{p.tokenNumber || "--"}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div style={{ flex: "0.8", padding: "40px", display: "flex", flexDirection: "column" }}>
                    <h2 style={{ fontSize: "2rem", color: "var(--warning)", borderBottom: "4px solid var(--warning)", paddingBottom: "16px", marginBottom: "40px" }}>
                        PLEASE WAIT
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
                        {waiting.length === 0 ? (
                            <div style={{ margin: "auto", textAlign: "center", color: "var(--text-muted)", fontSize: "1.5rem" }}>
                                No patients waiting
                            </div>
                        ) : (
                            waiting.slice(0, 5).map((p, i) => (
                                <div key={p.id} style={{
                                    background: "white",
                                    borderRadius: "12px",
                                    padding: "20px 30px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                                    opacity: 1 - (i * 0.15)
                                }}>
                                    <div style={{ fontSize: "1.75rem", fontWeight: "600", color: "var(--text-main)" }}>
                                        {p.patientName}
                                    </div>
                                    <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--primary-blue)" }}>
                                        {p.tokenNumber || "--"}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {waiting.length > 5 && (
                        <div style={{ textAlign: "center", marginTop: "20px", color: "var(--text-muted)", fontSize: "1.5rem" }}>
                            + {waiting.length - 5} more waiting...
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default TvDisplay;