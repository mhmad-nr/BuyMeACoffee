import { useState, useEffect, useRef } from 'react'
import image from "../../assets/images/img.png";
import { Button } from '../../components';
import { Formik, ErrorMessage, Field, Form } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { IPFS } from '../../service/api-ipfs';
import { ResponseType, TypeForm, stageType } from '../../types';
import { Modal } from '../../components';
import { ReactComponent as LoadingSvg } from '../../assets/icons/loading.svg'
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../hooks';
import { buyMeACoffeeContractFactory, isValidAddress, listenForEmitEvent, listenForTransactionMine } from '../../helpers';
import { CONTRACT_ERROR } from '../../utils/constant';

const englishRegex = /^[A-Za-z]+$/;

type TypePorp = {
    change: () => void
}

type TypeState = {
    imgUrl: string,
    modalStage: stageType,
    errorText: string,
}
const intialValues: TypeForm<File> = {
    fullName: "",
    discription: "",
    img: new File([""], "")
}
const Schema = Yup.object().shape({
    fullName: Yup.string()
        .min(3, "Your full name must be at least 3 characters")
        .matches(englishRegex, "FullName must be in English ")
        .required("Full name is required"),
    discription: Yup.string()
        .min(0)
        .matches(englishRegex, "Discription must be in English "),

    img: Yup.mixed().required("File must be specified")
})

const SingUp = ({ change }: TypePorp) => {
    const { store } = useStore()
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null)
    const [state, setState] = useState<TypeState>({
        imgUrl: image,
        modalStage: stageType.STAGE_HIDE,
        errorText: ""
    })
    useEffect(() => {
        // isExist().then()
    }, [])

    const onImage = () => inputRef.current && inputRef.current.click()
    const toastFun = (message: string) => { toast.error(message) }

    const saveDataToIPFS = async (e: TypeForm<File>): Promise<ResponseType<string>> => {
        const { fullName, discription, img } = e
        setState({ ...state, modalStage: stageType.STAGE_ONE })
        let res = await IPFS().uploadFile(img)
        if (!res.success) return res
        const json = {
            fullName,
            discription,
            img: res.data
        }
        setState({ ...state, modalStage: stageType.STAGE_TWO })
        return await IPFS().uploadJSON(json)
    }

    const saveOnChain = async (URLIPFS: string): Promise<ResponseType<string>> => {
        const { contract, provider } = await buyMeACoffeeContractFactory(store.activeAccount)

        console.log(URLIPFS);

        try {
            const transactionResponse = await contract.SingUp(URLIPFS)

            await listenForTransactionMine(transactionResponse, provider)
            const accountAddress = await listenForEmitEvent(contract, "SingUpEvent")
            console.log(accountAddress);


            // await res.wait(1)
            // const data = await contract.SearchAccount(store.activeAccount)
            return {
                success: true,
                data: accountAddress
            }

        } catch (error: any) {
            const decodedError = contract.interface.parseError(error.data);
            if (decodedError?.name == CONTRACT_ERROR.BMA.SIGNED_UP_BEFORE) {
                toast.error("this address is already signed up")
            }
            return {
                success: false,
                massage: "A problem has occurred with IPFS"
            }
        }
    }
    const signup = async (e: TypeForm<File>) => {
        const { contract } = await buyMeACoffeeContractFactory(store.activeAccount)
        const searchResponse = await contract.SearchAccount(store.activeAccount)
        if (isValidAddress(searchResponse)) {
            toast.error("this address is already signed up")
            toast.success("You are loging in please wait...")
            setTimeout(() => {
                navigate("/profile/" + searchResponse)
            }, 4000)
            return
        }
        // setState({ ...state, modalStage: stageType.STAGE_ONE })
        // const IPFSRespond = await saveDataToIPFS(e)
        // if (!IPFSRespond.success) {
        //     setState({ ...state, modalStage: stageType.STAGE_FIRST_ERROR, errorText: IPFSRespond.massage })
        //     return
        // }

        const IPFSRespond = {
            data: "https://gateway.pinata.cloud/ipfs/QmRzZ5NKTEGpRZaxAsmJBrN819Bs3zT9Btfq1X9WWRE69C"
        }

        setState({ ...state, modalStage: stageType.STAGE_TWO })
        const chainRespond = await saveOnChain(IPFSRespond.data)
        if (!chainRespond.success) {
            setState({ ...state, modalStage: stageType.STAGE_FIRST_ERROR, errorText: chainRespond.massage })
            return
        }

        navigate("/profile/" + chainRespond.data)
    }

    const disableClose = (state.modalStage != stageType.STAGE_ONE) && (state.modalStage != stageType.STAGE_TWO)
    const closeModal = async () => {
        if (!disableClose) return
        setState({ ...state, modalStage: stageType.STAGE_HIDE })
    }

    return (
        <>
            <Modal disableClose={disableClose} visable={state.modalStage != stageType.STAGE_HIDE} onClose={closeModal}>
                {state.modalStage == stageType.STAGE_FIRST_ERROR && <>
                    <p>{state.errorText}</p>
                </>}
                {state.modalStage == stageType.STAGE_ONE && <div className='flex items-center gap-x-8'>
                    <h2>Upload to IPFS...</h2>
                    <LoadingSvg />
                </div>}
                {state.modalStage == stageType.STAGE_TWO && <div className='flex items-center gap-x-8'>
                    <h2>Waiting for Metamsk ...</h2>
                    <LoadingSvg />
                </div>
                }
            </Modal>
            <Formik
                initialValues={intialValues}
                validationSchema={Schema}
                onSubmit={signup}
            >
                {({
                    errors,
                    handleSubmit,
                    setFieldValue,
                    isSubmitting
                }) => (
                    < Form >
                        <div className='w-full h-28 flex relative items-center gap-y-2'>
                            <p className='text-sm text-C4c font-light'>Select image:</p>
                            <div className='w-full absolute top-0 flex justify-center'>
                                <div onClick={onImage} className={`w-28 h-28 relative rounded-full overflow-hidden cursor-pointer border-2 ${errors.img ? "border-Red" : "border-Cf4"}`}>
                                    <input
                                        className='absolute invisible'
                                        type="file"
                                        name="file"
                                        ref={inputRef}
                                        accept="image/png, .svg, .jpg, .jpeg"
                                        onChange={(e: any) => {
                                            const file = e.target.files
                                            setFieldValue("img", file[0]);
                                            setState({ ...state, imgUrl: URL.createObjectURL(file[0]) });
                                        }}
                                    />
                                    <ErrorMessage name="file" render={toastFun} />
                                    <img src={state.imgUrl} className='w-full h-full relative z-50 scale-105' />
                                </div>
                            </div>
                        </div>


                        <div className='w-full flex mt-4 flex-col gap-y-4'>
                            <Field
                                className={`w-full text-base text-C4c font-light p-3 border-2 outline-none focus_border-Cye rounded-md ${errors.fullName ? "border-Red" : " border-C4"}`}
                                type="text"
                                name="fullName"
                                placeholder="Email" />

                            <ErrorMessage name="fullName" render={toastFun} />
                            <Field
                                className={`w-full  outline-none text-C4c focus_border-Cye p-3 font-light border-2 rounded-md resize-none ${errors.discription ? "border-Red" : "border-C4"}`}
                                as="textarea"
                                name="discription"
                                placeholder="Description" />
                            <ErrorMessage name="discription" render={toastFun} />

                        </div>
                        <div className='mt-4'>
                            <Button disable={isSubmitting} type='colored' buttonStyle='full' buttonText='White' color='bg-Cye' text={`Sign up`} onClick={handleSubmit} />
                        </div>
                    </Form>
                )}
            </Formik>
        </>

    )
}
export default SingUp

