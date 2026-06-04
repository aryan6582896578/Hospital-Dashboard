import React, { forwardRef } from "react";

const ConsultationPdfTemplate = forwardRef<
    HTMLDivElement,
    { consultation: any }
>(({ consultation }, ref) => {
    return (
        <div
            ref={ref}
            className="w-[794px] min-h-[1123px] bg-white"
            style={{ backgroundImage:"url('/letterhead0.jpg')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% auto",
                paddingTop: "180px",
                paddingLeft: "40px",
                paddingRight: "40px",
                paddingBottom: "40px",
                color: "black",
            }}
        >   
            <div className="text-[28px] font-bold mb-[20px]">
                Consultation Report
            </div>

            <div className="mb-[20px] flex gap-3">
                <div>
                    <b>Name:</b>{" "}
                    {consultation?.patient?.fullname}
                </div>

                <div>
                    <b>Age:</b>{" "}
                    {consultation.patient?.age}
                </div>

                <div>
                    <b>Gender:</b>{" "}
                    {consultation.patient?.gender}
                </div>

                <div>
                    <b>Phone:</b>{" "}
                    {
                        consultation.patient?.phonenumber
                    }
                </div>
            </div>

            <div className="mb-[20px]">
                <b>Date:</b>{" "}
                {new Date(
                    consultation.createdat
                ).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                })}
            </div>
            <div>
                <b>Medications</b>

                <table className="w-full mt-[10px] border-collapse">
                    <thead>
                        <tr>
                            <th className="border p-2">
                                Medicine
                            </th>
                            <th className="border p-2">
                                Dosage
                            </th>
                            <th className="border p-2">
                                Duration
                            </th>
                            <th className="border p-2">
                                Timing
                            </th>
                            <th className="border p-2">
                                Notes
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {consultation.medications.map(
                            (med: any) => (
                                <tr
                                    key={
                                        med.medicationid
                                    }
                                >
                                    <td className="border p-2">
                                        {
                                            med.medicinename
                                        }
                                    </td>

                                    <td className="border p-2">
                                        {med.dosage}
                                    </td>

                                    <td className="border p-2">
                                        {
                                            med.duration
                                        }
                                    </td>

                                    <td className="border p-2">
                                        {med.timing?.join(
                                            ", "
                                        )}
                                    </td>

                                    <td className="border p-2">
                                        {med.notes}
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

export default ConsultationPdfTemplate;