import React, { useRef, useEffect, useState } from 'react';
import uuid from 'uuid/v4';
import { attempt } from 'lodash-es';
import useModifiedProps from '../UseModifiedProps';
import useAxis from '../UseAxis';

export default function usePlotBandLineLifecycle(props, plotType) {
  const { id = uuid, axisId, children, ...rest } = props;

  const axis = useAxis(axisId);
  const idRef = useRef();
  const [plotbandline, setPlotbandline] = useState(null);
  const modifiedProps = useModifiedProps(rest);

  useEffect(() => {
    if (!axis) return;
    if (!plotbandline || modifiedProps !== false) {
      if (!plotbandline) {
        idRef.current = typeof id === 'function' ? id() : id;
      }
      const myId = idRef.current;
      const opts = {
        id: myId,
        ...rest
      };

      if (plotbandline) axis.removePlotBandOrLine(idRef.current);
      axis.addPlotBandOrLine(opts, plotType);
      setPlotbandline({
        id: myId,
        getPlotBandLine: () => {
          if (axis && axis.object && axis.object.plotLinesAndBands) {
            const plotbandlineObject = axis.object.plotLinesAndBands.find(
              plb => plb.id === myId
            );
            return plotbandlineObject;
          }
        }
      });
    }
  });

  useEffect(() => {
    return () => {
      attempt(axis.removePlotBandOrLine, idRef.current);
    };
  }, []);

  return plotbandline;
}
