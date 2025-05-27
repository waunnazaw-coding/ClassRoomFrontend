import { useParams } from "react-router-dom";
import ClassDetailCard from "@/components/class/ClassDetailCard";

function ClassDeatil() {
  const { classId } = useParams<{ classId: string }>();
  return (
    <div>
      <ClassDetailCard classId={Number(classId)} />
    </div>
  );
}

export default ClassDeatil;
