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
            const validData = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
            setQueue(validData);
        } catch (err) {
            console.error("Failed to fetch TV queue", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && queue.length === 0) {
        return <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#f8f9fa", color: "#6c757d", fontSize: "1.5rem", fontFamily: "Arial, sans-serif" }}>Loading display...</div>;
    }

    const inProgress = queue.filter(q => q.status?.toLowerCase() === "in-progress");
    const waiting = queue.filter(q => q.status?.toLowerCase() === "waiting");

    return (
        <div style={{
            maxWidth: "1200px",
            maxHeight: "800px",
            margin: "20px auto",
            backgroundColor: "#ffffff",
            border: "2px solid #dee2e6",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            fontFamily: "Arial, sans-serif"
        }}>

            <div style={{ backgroundColor: "#007bff", color: "white", padding: "20px", textAlign: "center" }}>
                <h1 style={{ fontSize: "2.5rem", margin: 0, fontWeight: "bold" }}>Patient Queue</h1>
            </div>

            <div style={{ display: "flex", flex: 1, backgroundColor: "#f8f9fa" }}>

                <div style={{ flex: "1.2", padding: "30px", display: "flex", flexDirection: "column", borderRight: "1px solid #dee2e6", backgroundColor: "white" }}>
                    <h2 style={{ fontSize: "1.8rem", color: "#28a745", borderBottom: "3px solid #28a745", paddingBottom: "10px", marginBottom: "30px" }}>
                        Currently Serving
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
                        {inProgress.length === 0 ? (
                            <div style={{ margin: "auto", textAlign: "center", color: "#6c757d", fontSize: "1.5rem" }}>
                                Doctor is available
                            </div>
                        ) : (
                            inProgress.slice(0, 3).map(p => (
                                <div key={p.id} style={{
                                    background: "#f8f9fa",
                                    border: "1px solid #28a745",
                                    borderRadius: "8px",
                                    padding: "20px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <div>
                                        <div style={{ fontSize: "1.2rem", color: "#6c757d", marginBottom: "5px" }}>Patient</div>
                                        <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#28a745" }}>{p.appointment?.patientName || p.patientName}</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: "1.2rem", color: "#6c757d", marginBottom: "5px" }}>Token</div>
                                        <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#28a745" }}>{p.tokenNumber || "--"}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div style={{ flex: "0.8", padding: "30px", display: "flex", flexDirection: "column" }}>
                    <h2 style={{ fontSize: "1.8rem", color: "#ffc107", borderBottom: "3px solid #ffc107", paddingBottom: "10px", marginBottom: "30px" }}>
                        Please Wait
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "15px", flex: 1 }}>
                        {waiting.length === 0 ? (
                            <div style={{ margin: "auto", textAlign: "center", color: "#6c757d", fontSize: "1.2rem" }}>
                                No patients waiting
                            </div>
                        ) : (
                            waiting.slice(0, 5).map((p, i) => (
                                <div key={p.id} style={{
                                    background: "white",
                                    borderRadius: "6px",
                                    padding: "15px 20px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    border: "1px solid #dee2e6",
                                    opacity: 1 - (i * 0.1)
                                }}>
                                    <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#495057" }}>
                                        {p.appointment?.patientName || p.patientName}
                                    </div>
                                    <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#007bff" }}>
                                        #{p.tokenNumber || "--"}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {waiting.length > 5 && (
                        <div style={{ textAlign: "center", marginTop: "20px", color: "#6c757d", fontSize: "1.2rem" }}>
                            + {waiting.length - 5} more waiting...
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default TvDisplay;