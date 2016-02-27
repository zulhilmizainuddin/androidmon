while true;
    do processInfo=$(ps | grep %s$);
        processInfoArray=($processInfo);
        pid=${processInfoArray[1]};
        if [ $pid ];
            then su -c LD_LIBRARY_PATH=/data/local/tmp ./data/local/tmp/nettomon $pid -l;
            else echo "Tx 0.0 KB  |  Rx 0.0 KB";
                 sleep 1;
        fi;
    done