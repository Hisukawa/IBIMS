import Accordion from "@/Components/Accordion";
import React from "react";
import DistributionProcess from "./DistributionProcess";
import TraningsInventory from "./TraningsInventory";
import ResponsiveEuipInventory from "./ResponsiveEuipInventory";
import BdrrmcDirectory from "./BdrrmcDirectory";
import BarangayEvacuationPlan from "./BarangayEvacuationPlan";
const DisasterReadiness = () => {
    return (
        <div>
            <Accordion title="11. Distribution of Relief Goods to Affected Families and Individuals">
                <DistributionProcess />
            </Accordion>
            <Accordion title="12. Inventory of Trainings Attended by the Members of BDRRMC">
                <TraningsInventory />
            </Accordion>
            <Accordion
                title="13. Inventory of Responsive Equipment that can be utilized during Calamities
            and Disasters"
            >
                <ResponsiveEuipInventory />
            </Accordion>
            <Accordion title="BDRRMC Directory">
                <BdrrmcDirectory />
            </Accordion>
            <Accordion title="Barangay Evacuation Plan">
                <BarangayEvacuationPlan />
            </Accordion>
        </div>
    );
};

export default DisasterReadiness;
