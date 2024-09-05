import { Card, CardHeader, Divider, Skeleton, SvgIcon } from "@mui/material";
import { ActionList } from "../../components/action-list";
import { ActionListItem } from "../../components/action-list-item";
import { PropertyList } from "../../components/property-list";
import { PropertyListItem } from "../../components/property-list-item";
import { useDialog } from "../../hooks/use-dialog";
import { CippApiDialog } from "../CippComponents/CippApiDialog";
import { useState } from "react";

export const CippPropertyListCard = (props) => {
  const {
    align = "vertical",
    actionItems = [],
    propertyItems = [],
    isFetching,
    title,
    actionButton,
    copyItems = false,
    data,
    ...other
  } = props;
  const createDialog = useDialog();
  const [actionData, setActionData] = useState({ data: {}, action: {}, ready: false });
  return (
    <>
      <Card sx={{ width: "100%" }} {...other}>
        <CardHeader action={actionButton} title={title} />
        <Divider />
        <PropertyList>
          {isFetching ? (
            <>
              <PropertyListItem
                key={"loading-bar"}
                align={align}
                label="Loading"
                value={<Skeleton width={280} />}
              />
            </>
          ) : (
            propertyItems.map((item, index) => (
              <PropertyListItem
                align={align}
                copyItems
                divider
                key={`${index}-index-PropertyListOffCanvas`}
                {...item}
              />
            ))
          )}
        </PropertyList>
        <Divider />
        <ActionList>
          {actionItems.map((item, index) => (
            <ActionListItem
              key={`${item.label}-index-ActionList-OffCanvas`}
              icon={<SvgIcon fontSize="small">{item.icon}</SvgIcon>}
              label={item.label}
              onClick={
                //if item.link is set, browse there in a new tab
                item.link
                  ? () => window.open(item.link, "_blank")
                  : () => {
                      setActionData({
                        data: data,
                        action: item,
                        ready: true,
                      });
                      createDialog.handleOpen();
                    }
              }
            />
          ))}
        </ActionList>
        {actionData.ready && (
          <CippApiDialog
            createDialog={createDialog}
            title="Confirmation"
            fields={actionData.action?.fields}
            api={actionData.action}
            row={actionData.data}
          />
        )}
      </Card>
    </>
  );
};