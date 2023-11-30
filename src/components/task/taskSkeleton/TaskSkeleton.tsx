import Skeleton from 'react-loading-skeleton'
import {FC} from "react";


type TaskSkeletonPropsType = {
    count:number
}

export const TaskSkeleton:FC<TaskSkeletonPropsType> = ({ count }) => {

    return <>
        {Array(count)
            .fill(null)
            .map((_, index) => (
                <ul key={index}>
                    <li>
                        <span><Skeleton width={120}/></span>
                    </li>
                </ul>
            ))}
    </>
}