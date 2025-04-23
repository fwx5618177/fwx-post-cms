import { Spin } from "antd";

const SpinLoading = () => (
    <div
        style={{
            width: "100%",
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
        }}
    >
        <Spin size="large" />
    </div>
);

export default SpinLoading;
