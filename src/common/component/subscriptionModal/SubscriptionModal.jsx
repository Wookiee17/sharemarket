import React, { useEffect, useState } from "react";
import { Modal, Card, Button, Spin, Alert } from "antd";
import { BankOutlined, LoadingOutlined } from "@ant-design/icons";

import axios from "axios";

const SubscriptionModal = () => {
  // State
  const [subscriptionModal, setSubscriptionModal] = useState(false);
  const [plansAPI, setPlansAPI] = useState({
    loading: true,
    error: null,
    data: [],
  });
  const [selectedPlan, setSelectedPlan] = useState({});

  // Loading Icon
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  // Function
  function handleSubscriptionModal() {
    setSubscriptionModal(false);
  }

  async function fetchPlans() {
    try {
      setPlansAPI({
        ...plansAPI,
        loading: true,
      });
      const { data } = await axios.get(`/api/payments/fetch-plans`);
      setPlansAPI({
        loading: false,
        error: null,
        data: data?.items,
      });
    } catch (err) {
      console.log(err);
      setPlansAPI({
        loading: false,
        error: err.message,
        ...plansAPI,
      });
    }
  }

  // UseEffect
  useEffect(() => {
    setTimeout(() => {
      fetchPlans();
      setSubscriptionModal(true);
    }, 2000);
  }, []);

  return (
    <Modal
      title="Choose Your Subscription Plan"
      open={subscriptionModal}
      className={"Modal"}
      onCancel={() => handleSubscriptionModal()}
      footer={[]}
      centered
      width={1000}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          {plansAPI?.loading ? (
            <Spin indicator={antIcon} />
          ) : plansAPI?.error !== null ? (
            <Alert message={`${plansAPI?.error}`} type="error" />
          ) : plansAPI.data?.length > 0 ? (
            plansAPI?.data?.map((plan, index) => (
              <Card
                key={index}
                style={{ width: 300, margin: "10px", textAlign: "center" }}
                hoverable
                onClick={() => {
                  setSelectedPlan(plan);
                }}
                className={
                  Object.keys(selectedPlan).length > 0 &&
                  selectedPlan?.id === plan.id
                    ? "selected-plan"
                    : ""
                }
              >
                <h2>{plan.item.name}</h2>
                <h1>
                  ₹{plan.item.amount / 100} /{" "}
                  <span style={{ textTransform: "capitalize" }}>
                    {plan.period}
                  </span>
                </h1>
                <ul style={{ listStyleType: "none" }}>
                  {plan?.item?.description.split("\n").map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
                <Button
                  type="primary"
                  disabled={
                    Object.keys(selectedPlan).length === 0 ||
                    selectedPlan?.id !== plan.id
                  }
                  style={{ marginTop: "16px" }}
                  onClick={() => {}}
                >
                  <BankOutlined /> Pay Now
                </Button>
              </Card>
            ))
          ) : (
            <Alert message="No Plans To Display" type="info" />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
