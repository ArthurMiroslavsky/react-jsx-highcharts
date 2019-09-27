import React, { useRef, useEffect, useState } from 'react';
import uuid from 'uuid/v4';
import { attempt } from 'lodash-es';
import useModifiedProps from '../UseModifiedProps';
import useAxis from '../UseAxis';

export default function usePlotBandLine(props, plotType) {
  const { id = uuid, children, ...rest } = props;

  const axis = useAxis();
  const idRef = useRef();
  const [plotbandline, setPlotbandline] = useState(null);
  const modifiedProps = useModifiedProps(rest);

  useEffect(() => {
    if (!axis || !plotbandline) return;
    if (modifiedProps !== false) {
      axis.removePlotBandOrLine(idRef.current);
      const opts = {
        id: idRef.current,
        ...modifiedProps
      };
      setPlotbandline(axis.addPlotBandOrLine(opts, plotType));
    }
  });

  // create plotline
  useEffect(() => {
    if (!axis) return;
    idRef.current = typeof id === 'function' ? id() : id;
    const myId = idRef.current;
    const opts = {
      id: myId,
      ...rest
    };
    setPlotbandline(axis.addPlotBandOrLine(opts, plotType));

    return () => {
      attempt(axis.removePlotBandOrLine, idRef.current);
    };
  }, [axis]);

  return plotbandline;
}
