const hardwareOptions = [
    { label: "CPUs", options: [
        { value: "-cpu1", label: "CPU1" },
        { value: "-cpu2", label: "CPU2" },
        { value: "-cpu3", label: "CPU3" }
    ]},
    { label: "GPUs", options: [
        { value: "-gpu1", label: "GPU1", price: "$100" },
        { value: "-gpu2", label: "GPU2", price: "$200" },
        { value: "-gpu3", label: "GPU3", price: "$300" }
    ]}
];

export default hardwareOptions;
