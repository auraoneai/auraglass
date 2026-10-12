import { DescriptionList } from 'aura-glass';

export default function DescriptionListMinimal() {
  return (
    <DescriptionList>
      <DescriptionList.Item>
        <DescriptionList.Term>Plan</DescriptionList.Term>
        <DescriptionList.Details>Team (annual)</DescriptionList.Details>
      </DescriptionList.Item>
      <DescriptionList.Item>
        <DescriptionList.Term>Seats</DescriptionList.Term>
        <DescriptionList.Details>24 of 30</DescriptionList.Details>
      </DescriptionList.Item>
    </DescriptionList>
  );
}
