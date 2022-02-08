var SciPresMonitor = {
    units: [
        "psi",
        "mmHg",
        "kPa",
        "bar"
    ],

    name: "SciPres Monitor I",
    int_name: "scipres_1",
    channels: [1, 2, 3, 4],
    volumetric: false
};

var PendotechPresMonitor = {
    units: [
        "psi",
        "mmHg",
        "kPa",
        "bar"
    ],

    name: "Pendotech PressureMAT",
    int_name: "pendo_1",
    channels: [1, 2, 3],
    volumetric: false
}

var ScaleMonitor = {
    units: [
        "auto",
    ],
    name : "AnD Scale",
    int_name: "scale_1",
    channels: [1],
    volumetric: true
};
var PendoTechPressure = {
    units: [
        "psi",
        "mmHg",
        "kPa",
        "bar"
    ],

    name: "PendoTech Pressure Sensor",
    int_name: "pend_pres_1",
    channels: [1,2,3],
    volumetric: false
};


var NoSelectType = {
    units: ["N/A"],
    name: "No Sensor",
    int_name:"none",
    channels: [0],
    volumetric: false
};



var SecondarySelections = [NoSelectType, SciPresMonitor,PendotechPresMonitor];
var VolumetricSelections = [NoSelectType,ScaleMonitor]
exports.SecondarySelections = SecondarySelections;
exports.VolumetricSelections = VolumetricSelections;