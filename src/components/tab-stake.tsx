import { Form, InputNumber } from "antd";
import BigNumber from "bignumber.js";

import { NAME_METHOD_STAKE, NAME_METHOD_UN_STAKE } from "@/constants";
import { useStake } from "@/hooks";
import { formatNumberPayment } from "@/utils";

import { ButtonConnect } from "./button-connect";

import { MdOutlineSwapVert } from "react-icons/md";

export function TabStake() {
    const [form] = Form.useForm();

    const {
        formToken,
        toToken,
        balanceOfUSDB,
        balanceOfSUSDB,
        isPending,
        allowance,
        messageError,
        renderToken,
        handleSwap,
        handleApprove,
        handleStakeUnStake,
    } = useStake();

    const balanceFormToken = formToken.name === renderToken["USDB"].name ? balanceOfUSDB : balanceOfSUSDB;
    const balanceToToken = toToken.name === renderToken["SUSDB"].name ? balanceOfSUSDB : balanceOfUSDB;

    const onFinish = async ({ amount }: { amount: number }) => {
        const isAllowance = new BigNumber(allowance as string).isGreaterThan(new BigNumber(amount));
        const method = formToken.method as typeof NAME_METHOD_STAKE | typeof NAME_METHOD_UN_STAKE;
        if (!isAllowance) {
            const error = await handleApprove(formToken.address, toToken.address);
            if (!error) {
                const errorStakeUnStake = await handleStakeUnStake(amount, method, formToken.name);
                if (!errorStakeUnStake) {
                    form.resetFields();
                }
            }
        } else {
            const error = await handleStakeUnStake(amount, method, formToken.name);
            if (!error) {
                form.resetFields();
            }
        }
    };

    return (
        <div className="flex flex-col justify-center gap-5 mx-auto max-w-[400px]">
            <div className="px-6 py-5 border rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold text-center">
                    {formToken.method === NAME_METHOD_STAKE
                        ? `${NAME_METHOD_STAKE} ${renderToken["USDB"].name}`
                        : `${NAME_METHOD_UN_STAKE} ${renderToken["SUSDB"].name}`}
                </h1>
                <Form
                    onFinish={onFinish}
                    className="!mt-5"
                    size="large"
                    disabled={isPending || !!messageError}
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        className=""
                        label=""
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: `Please input your ${formToken.name}!`,
                            },
                            ({ setFieldValue }) => ({
                                validator(_, value: number) {
                                    const amount = Number(value) > 99 ? 99 : value;
                                    setFieldValue("USDB", amount);
                                    setFieldValue("amount", amount);
                                    if (!balanceFormToken && value)
                                        return Promise.reject(new Error("Balance not enough!"));
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between gap-10">
                                <div className="flex items-center gap-0.5">
                                    <p className="text-red-600">*</p>
                                    <h1 className="font-semibold">{formToken.name}</h1>
                                </div>
                                <p>{`Balance: ${formatNumberPayment(balanceFormToken)}`}</p>
                            </div>
                            <InputNumber
                                onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                min={1}
                                max={99}
                                placeholder="0"
                                controls={false}
                                className="!w-full"
                            />
                        </div>
                    </Form.Item>
                    <div className="flex justify-center">
                        <MdOutlineSwapVert size={23} onClick={handleSwap} className="cursor-pointer" />
                    </div>
                    <div>
                        <div className="flex items-center justify-between gap-10 mb-2">
                            <h1 className="font-semibold">{toToken.name}</h1>
                            <p>{`Balance: ${formatNumberPayment(balanceToToken)}`}</p>
                        </div>
                        <Form.Item label="" name="USDB">
                            <InputNumber placeholder="0" disabled readOnly controls={false} className="!w-full" />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <ButtonConnect loading={isPending} title={formToken.method} />
                        {messageError && (
                            <p className="mt-2 text-xs font-medium text-red-600">{`Error: ${messageError}`}</p>
                        )}
                    </Form.Item>
                </Form>
                <p className="text-base text-center">
                    Note: <span className="text-sm">Only active on opBNB Testnet</span>
                </p>
            </div>
        </div>
    );
}
