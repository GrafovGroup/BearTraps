import EquipmentPackage from "@/components/equipment-package";
import { Breadcrumb } from "@/components/site";
export const metadata = {
  title: "Equipment package builder",
  description:
    "Coordinate capture, transport, signage, monitoring and consumables in one professional equipment request.",
  alternates: { canonical: "/equipment-package/" },
};
export default function PackagePage() {
  return (
    <>
      <div className="page-intro">
        <Breadcrumb title="Equipment package" />
        <p className="eyebrow">COORDINATED FIELD REQUIREMENTS</p>
        <h1>
          Build the complete
          <br />
          equipment request.
        </h1>
        <p className="large-copy">
          Bring the capture system, transport, safety signage and monitoring
          requirements together. Set quantities now, then add specifications in
          your RFQ.
        </p>
      </div>
      <section className="section">
        <EquipmentPackage />
      </section>
    </>
  );
}
